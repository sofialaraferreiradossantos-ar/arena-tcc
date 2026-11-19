const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const { stripe, obterCustomer, paraCentavos, dataBR } = require("./stripe");

// =====================================================
// FATURAS MENSAIS COM STRIPE INVOICING
//
// Para clientes fixos (mensalistas, escolinhas, grupos), o administrador
// cria as reservas pelo painel (POST /agendamentos) e, no fim do mês,
// o sistema junta todas as reservas do cliente que ainda não têm
// pagamento e manda UMA fatura pelo Stripe.
//
// Como funciona:
// 1. Cada reserva da fatura ganha um pagamento "pendente" com forma
//    'Fatura' e o id da fatura (stripe_invoice_id).
// 2. O Stripe envia a fatura por e-mail. O cliente paga na página da
//    fatura (cartão, Pix ou boleto, conforme ativado no Dashboard).
// 3. Quando o Stripe confirma (webhook invoice.paid), os pagamentos
//    viram "pago" e as reservas viram "confirmado" (ver stripe.js).
// =====================================================

// Prazo para pagar a fatura, em dias
const DIAS_PARA_VENCER = Number(process.env.FATURA_DIAS_VENCIMENTO) || 7;

const MES_VALIDO = /^\d{4}-(0[1-9]|1[0-2])$/;

function mesBR(mes) {
    const [ano, numero] = mes.split("-");
    return `${numero}/${ano}`;
}

function mesAnterior() {
    const hoje = new Date();
    const anterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    return `${anterior.getFullYear()}-${String(anterior.getMonth() + 1).padStart(2, "0")}`;
}

// Reservas do mês que ainda não têm pagamento pendente nem pago.
// (Reservas pagas online sempre têm pagamento, então não entram aqui.)
const SQL_RESERVAS_A_FATURAR = `
    SELECT
        a.id_agend,
        a.id_usu,
        DATE_FORMAT(a.dt_agend, '%Y-%m-%d') AS dt_agend,
        TIME_FORMAT(a.hora_inicio, '%H:%i') AS hora_inicio,
        TIME_FORMAT(a.hora_fim, '%H:%i') AS hora_fim,
        q.nome_qd,
        q.valor_qd
    FROM agendamentos a
    INNER JOIN quadras q ON q.id_qd = a.id_qd
    WHERE DATE_FORMAT(a.dt_agend, '%Y-%m') = ?
      AND a.status_agend <> 'cancelado'
      AND NOT EXISTS (
          SELECT 1 FROM pagamentos p
          WHERE p.id_agend = a.id_agend
            AND p.status_pag IN ('pendente', 'pago')
      )
`;

// Gera e envia a fatura de um cliente para um mês.
// Devolve null se o cliente não tiver nada para faturar.
async function gerarFatura(id_usu, mes) {
    const cliente = stripe();
    if (!cliente) throw new Error("STRIPE_SECRET_KEY não configurada.");

    // 1. Reserva os agendamentos no banco (pagamentos "pendente").
    //    O FOR UPDATE impede que duas execuções faturem a mesma reserva.
    const conexao = await db.getConnection();
    let reservas;
    let id_pags;

    try {
        await conexao.beginTransaction();

        const [rows] = await conexao.query(
            `${SQL_RESERVAS_A_FATURAR} AND a.id_usu = ? ORDER BY a.dt_agend, a.hora_inicio FOR UPDATE;`,
            [mes, id_usu]
        );
        reservas = rows.filter((r) => paraCentavos(r.valor_qd) > 0);

        if (reservas.length === 0) {
            await conexao.rollback();
            return null;
        }

        id_pags = [];
        for (const reserva of reservas) {
            const [pagamento] = await conexao.query(
                `INSERT INTO pagamentos (id_agend, valor_pag, forma_pag, status_pag)
                 VALUES (?, ?, 'Fatura', 'pendente');`,
                [reserva.id_agend, reserva.valor_qd]
            );
            id_pags.push(pagamento.insertId);
        }

        await conexao.commit();
    } catch (error) {
        await conexao.rollback().catch(() => {});
        throw error;
    } finally {
        conexao.release();
    }

    // 2. Cria a fatura no Stripe com uma linha por reserva
    let fatura = null;

    try {
        const customer = await obterCustomer(id_usu);

        fatura = await cliente.invoices.create(
            {
                customer,
                currency: "brl",
                collection_method: "send_invoice",
                days_until_due: DIAS_PARA_VENCER,
                // Depois de finalizada, o Stripe cuida da cobrança e dos lembretes
                auto_advance: true,
                description: `Reservas de quadra - ${mesBR(mes)}`,
                metadata: { id_usu: String(id_usu), mes, tipo: "fatura_mensal" }
            },
            { idempotencyKey: `fatura-${id_usu}-${mes}-${id_pags[0]}` }
        );

        for (let i = 0; i < reservas.length; i++) {
            const reserva = reservas[i];
            await cliente.invoiceItems.create(
                {
                    customer,
                    invoice: fatura.id,
                    currency: "brl",
                    amount: paraCentavos(reserva.valor_qd),
                    description: `${reserva.nome_qd} - ${dataBR(reserva.dt_agend)}, das ${reserva.hora_inicio} às ${reserva.hora_fim}`,
                    metadata: { id_agend: String(reserva.id_agend), id_pag: String(id_pags[i]) }
                },
                { idempotencyKey: `fatura-item-${id_pags[i]}` }
            );
        }

        // Grava o id da fatura ANTES de finalizar, para o webhook
        // invoice.paid sempre encontrar os pagamentos.
        await db.query(
            "UPDATE pagamentos SET stripe_invoice_id = ? WHERE id_pag IN (?);",
            [fatura.id, id_pags]
        );

        fatura = await cliente.invoices.finalizeInvoice(fatura.id, { auto_advance: true });
    } catch (error) {
        // Não conseguiu montar a fatura: apaga o rascunho e libera as reservas
        if (fatura && fatura.status === "draft") {
            await cliente.invoices.del(fatura.id).catch(() => {});
        }
        await db.query(
            "UPDATE pagamentos SET status_pag = 'cancelado' WHERE id_pag IN (?) AND status_pag = 'pendente';",
            [id_pags]
        ).catch(() => {});
        throw error;
    }

    // 3. Envia por e-mail. Se o envio falhar, a fatura continua válida
    //    e o link pode ser mandado ao cliente por outro canal.
    try {
        fatura = await cliente.invoices.sendInvoice(fatura.id);
    } catch (error) {
        console.error(`[stripe] Fatura ${fatura.id} criada, mas o e-mail não foi enviado:`, error.message);
    }

    return {
        id_fatura: fatura.id,
        numero: fatura.number,
        status: fatura.status,
        valor: (fatura.total / 100).toFixed(2),
        vencimento: fatura.due_date ? new Date(fatura.due_date * 1000).toISOString().slice(0, 10) : null,
        link: fatura.hosted_invoice_url,
        reservas: reservas.map((r, i) => ({ id_agend: r.id_agend, id_pag: id_pags[i] }))
    };
}

// Clientes com reservas a faturar no mês (para o painel e para o script)
async function listarClientesAFaturar(mes) {
    const [rows] = await db.query(
        `
            SELECT
                u.id_usu,
                u.nome_usu,
                u.email_usu,
                COUNT(*) AS reservas,
                SUM(r.valor_qd) AS total
            FROM (${SQL_RESERVAS_A_FATURAR}) r
            INNER JOIN usuarios u ON u.id_usu = r.id_usu
            GROUP BY u.id_usu, u.nome_usu, u.email_usu
            ORDER BY u.nome_usu;
        `,
        [mes]
    );

    return rows.map((row) => ({
        id_usu: row.id_usu,
        nome: row.nome_usu,
        email: row.email_usu,
        reservas: Number(row.reservas),
        total: Number(row.total).toFixed(2)
    }));
}

function lerMes(valor) {
    const mes = valor || mesAnterior();
    return MES_VALIDO.test(String(mes)) ? mes : null;
}

module.exports = {

    gerarFatura,
    listarClientesAFaturar,
    mesAnterior,

    // =====================================================
    // A FATURAR - GET /faturas/pendentes?mes=AAAA-MM (admin)
    // Sem "mes", usa o mês anterior.
    // =====================================================
    async listarPendentes(request, response) {
        try {
            const mes = lerMes(request.query.mes);
            if (!mes) {
                return response.status(400).json({ sucesso: false, mensagem: "Mês inválido. Use AAAA-MM.", dados: null });
            }

            const dados = await listarClientesAFaturar(mes);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Clientes com reservas a faturar em ${mesBR(mes)}.`,
                items: dados.length,
                dados
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // GERAR FATURA - POST /faturas (admin)
    // Body: { id_usu, mes: "AAAA-MM" }. Sem "mes", usa o mês anterior.
    // =====================================================
    async criarFatura(request, response) {
        if (!stripe()) {
            return response.status(503).json({
                sucesso: false,
                mensagem: "Faturas indisponíveis: configure STRIPE_SECRET_KEY no backend.",
                dados: null
            });
        }

        const { id_usu } = request.body || {};
        const mes = lerMes(request.body?.mes);

        if (!validarId(id_usu)) {
            return response.status(400).json({ sucesso: false, mensagem: "Informe o id_usu do cliente.", dados: null });
        }
        if (!mes) {
            return response.status(400).json({ sucesso: false, mensagem: "Mês inválido. Use AAAA-MM.", dados: null });
        }

        try {
            const fatura = await gerarFatura(Number(id_usu), mes);

            if (!fatura) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Este cliente não tem reservas a faturar em ${mesBR(mes)}.`,
                    dados: null
                });
            }

            return response.status(201).json({
                sucesso: true,
                mensagem: `Fatura de ${mesBR(mes)} criada e enviada ao cliente.`,
                dados: fatura
            });
        } catch (error) {
            console.error("[stripe] Erro ao gerar fatura:", error.message);
            return response.status(502).json({
                sucesso: false,
                mensagem: "Não foi possível gerar a fatura no Stripe. Tente novamente.",
                dados: null
            });
        }
    }
};
