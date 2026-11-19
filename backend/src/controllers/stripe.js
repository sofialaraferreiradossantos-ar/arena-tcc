const Stripe = require("stripe");
const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const { validarReservaCliente, existeConflito } = require("../utils/agendamento");
const { notificarAdmins } = require("../utils/notificacoes");

// =====================================================
// PAGAMENTO ONLINE COM STRIPE CHECKOUT
//
// Por que é seguro:
// 1. Os dados do cartão/Pix são digitados na página do Stripe, nunca
//    passam pelo nosso frontend nem pelo nosso backend.
// 2. O VALOR é calculado aqui no servidor a partir do banco (valor_qd),
//    então o cliente não consegue alterar o preço.
// 3. O pagamento só vira "pago" depois que o próprio Stripe confirma:
//    pelo webhook assinado (STRIPE_WEBHOOK_SECRET) ou por uma consulta
//    feita pelo servidor direto na API do Stripe.
// =====================================================

// Tempo para o cliente concluir o pagamento antes de o horário ser liberado.
// O Stripe exige que a sessão do Checkout dure pelo menos 30 minutos.
const MINUTOS_PARA_PAGAR = 31;

const ID_SESSAO_VALIDO = /^cs_(test|live)_[A-Za-z0-9]+$/;

let clienteStripe = null;

function stripe() {
    if (!process.env.STRIPE_SECRET_KEY) return null;
    if (!clienteStripe) clienteStripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return clienteStripe;
}

function urlFrontend() {
    return String(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
}

function stripeNaoConfigurado(response) {
    return response.status(503).json({
        sucesso: false,
        mensagem: "Pagamento online indisponível: configure STRIPE_SECRET_KEY no backend.",
        dados: null
    });
}

function dataBR(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function paraCentavos(valor) {
    return Math.round(Number(valor) * 100);
}

// -----------------------------------------------------
// Cliente no Stripe (Customer)
// Cada usuário ganha um Customer na primeira vez que precisa dele
// (pagamento online ou fatura). Assim os pagamentos e as faturas
// ficam agrupados por cliente no Dashboard do Stripe.
// -----------------------------------------------------
async function obterCustomer(id_usu) {
    const [rows] = await db.query(
        "SELECT id_usu, nome_usu, email_usu, stripe_customer_id FROM usuarios WHERE id_usu = ?;",
        [id_usu]
    );
    const usuario = rows[0];
    if (!usuario) throw new Error(`Usuário ${id_usu} não encontrado.`);
    if (usuario.stripe_customer_id) return usuario.stripe_customer_id;

    // A chave de idempotência evita criar dois Customers para o mesmo usuário
    // se duas requisições chegarem ao mesmo tempo.
    const customer = await stripe().customers.create(
        {
            name: usuario.nome_usu,
            email: usuario.email_usu,
            preferred_locales: ["pt-BR"],
            metadata: { id_usu: String(usuario.id_usu) }
        },
        { idempotencyKey: `customer-usuario-${usuario.id_usu}` }
    );

    await db.query(
        "UPDATE usuarios SET stripe_customer_id = ? WHERE id_usu = ? AND stripe_customer_id IS NULL;",
        [customer.id, usuario.id_usu]
    );

    // Se outra requisição gravou primeiro, usa o que está no banco
    const [atual] = await db.query("SELECT stripe_customer_id FROM usuarios WHERE id_usu = ?;", [usuario.id_usu]);
    return atual[0].stripe_customer_id;
}

function formaDoStripe(sessao) {
    const tipo = sessao.payment_intent?.payment_method?.type;
    if (tipo === "pix") return "Pix";
    if (tipo === "card") return "Cartão";
    return "Online";
}

// -----------------------------------------------------
// Regras de status (sempre "só muda se ainda estiver pendente",
// assim eventos repetidos do Stripe não causam efeito duplo)
// -----------------------------------------------------

async function marcarComoPago(pagamento, forma) {
    const [resultado] = await db.query(
        "UPDATE pagamentos SET status_pag = 'pago', forma_pag = ? WHERE id_pag = ? AND status_pag = 'pendente';",
        [forma, pagamento.id_pag]
    );

    if (resultado.affectedRows > 0) {
        await db.query(
            "UPDATE agendamentos SET status_agend = 'confirmado' WHERE id_agend = ? AND status_agend = 'pendente';",
            [pagamento.id_agend]
        );
        await avisarNovaReserva(pagamento, forma);
    }
}

// Avisa os administradores que uma reserva foi paga e confirmada.
// A chave evita aviso duplicado se o webhook e a tela confirmarem juntos.
async function avisarNovaReserva(pagamento, forma) {
    try {
        const [[reserva]] = await db.query(
            `
                SELECT
                    u.nome_usu,
                    q.nome_qd,
                    DATE_FORMAT(a.dt_agend, '%d/%m/%Y') AS data,
                    TIME_FORMAT(a.hora_inicio, '%H:%i') AS inicio,
                    TIME_FORMAT(a.hora_fim, '%H:%i') AS fim
                FROM agendamentos a
                INNER JOIN usuarios u ON u.id_usu = a.id_usu
                INNER JOIN quadras q ON q.id_qd = a.id_qd
                WHERE a.id_agend = ?;
            `,
            [pagamento.id_agend]
        );

        if (!reserva) return;

        await notificarAdmins({
            tipo: "nova_reserva",
            titulo: "Nova reserva confirmada",
            mensagem: `${reserva.nome_usu} reservou ${reserva.nome_qd} em ${reserva.data}, das ${reserva.inicio} às ${reserva.fim} (pago via ${forma}).`,
            link: "/administrador/agendamentos",
            chave: `reserva-paga-${pagamento.id_pag}`
        });
    } catch (error) {
        console.error("[notificacoes] Erro ao avisar nova reserva:", error.message);
    }
}

async function cancelarPendente(pagamento) {
    const [resultado] = await db.query(
        "UPDATE pagamentos SET status_pag = 'cancelado' WHERE id_pag = ? AND status_pag = 'pendente';",
        [pagamento.id_pag]
    );

    // Libera o horário da quadra
    if (resultado.affectedRows > 0) {
        await db.query(
            "UPDATE agendamentos SET status_agend = 'cancelado' WHERE id_agend = ? AND status_agend = 'pendente';",
            [pagamento.id_agend]
        );
    }
}

// Busca a sessão direto na API do Stripe (fonte confiável) e atualiza o banco.
async function sincronizarSessao(idSessao, { falhou = false } = {}) {
    const [rows] = await db.query(
        "SELECT id_pag, id_agend, valor_pag, status_pag FROM pagamentos WHERE stripe_session_id = ?;",
        [idSessao]
    );

    if (rows.length === 0) return null;

    const pagamento = rows[0];
    if (pagamento.status_pag !== "pendente") return pagamento;

    const sessao = await stripe().checkout.sessions.retrieve(idSessao, {
        expand: ["payment_intent.payment_method"]
    });

    if (sessao.payment_status === "paid") {
        // Confere se o valor cobrado é exatamente o valor registrado
        if (sessao.currency !== "brl" || sessao.amount_total !== paraCentavos(pagamento.valor_pag)) {
            console.error(
                `[stripe] Valor divergente no pagamento ${pagamento.id_pag}: ` +
                `cobrado ${sessao.amount_total} ${sessao.currency}, esperado ${paraCentavos(pagamento.valor_pag)} brl.`
            );
            return pagamento;
        }

        await marcarComoPago(pagamento, formaDoStripe(sessao));
    } else if (sessao.status === "expired" || falhou) {
        await cancelarPendente(pagamento);
    }

    const [atualizado] = await db.query(
        "SELECT id_pag, id_agend, valor_pag, status_pag FROM pagamentos WHERE id_pag = ?;",
        [pagamento.id_pag]
    );
    return atualizado[0];
}

// -----------------------------------------------------
// Faturas mensais (ver controllers/faturas.js)
// Uma fatura junta várias reservas: todos os pagamentos com o mesmo
// stripe_invoice_id mudam de status juntos.
// -----------------------------------------------------

// Fatura paga: consulta o Stripe (fonte confiável) e confirma as reservas
async function sincronizarFaturaPaga(idFatura) {
    const fatura = await stripe().invoices.retrieve(idFatura);
    if (fatura.status !== "paid") return;

    const [pendentes] = await db.query(
        "SELECT id_pag, valor_pag FROM pagamentos WHERE stripe_invoice_id = ? AND status_pag = 'pendente';",
        [idFatura]
    );
    if (pendentes.length === 0) return;

    // O admin pode ter dado desconto na fatura pelo Dashboard: só avisa no log
    const esperado = pendentes.reduce((total, p) => total + paraCentavos(p.valor_pag), 0);
    if (fatura.currency !== "brl" || fatura.total !== esperado) {
        console.warn(
            `[stripe] Fatura ${idFatura} paga com valor diferente das reservas: ` +
            `${fatura.total} ${fatura.currency}, esperado ${esperado} brl.`
        );
    }

    await db.query(
        "UPDATE pagamentos SET status_pag = 'pago' WHERE stripe_invoice_id = ? AND status_pag = 'pendente';",
        [idFatura]
    );
    await db.query(
        `UPDATE agendamentos a
         INNER JOIN pagamentos p ON p.id_agend = a.id_agend
         SET a.status_agend = 'confirmado'
         WHERE p.stripe_invoice_id = ? AND p.status_pag = 'pago' AND a.status_agend = 'pendente';`,
        [idFatura]
    );
}

// Fatura anulada no Dashboard: as reservas voltam a poder ser faturadas
async function cancelarFatura(idFatura) {
    await db.query(
        "UPDATE pagamentos SET status_pag = 'cancelado' WHERE stripe_invoice_id = ? AND status_pag = 'pendente';",
        [idFatura]
    );
}

// Estorno total feito fora do sistema (ex.: pelo Dashboard do Stripe).
// Os estornos feitos pelo próprio sistema também disparam este evento;
// como o UPDATE só age em pagamentos ainda "pago", não há efeito duplo.
async function sincronizarEstorno(cobranca) {
    if (!cobranca.refunded) return; // estorno parcial: não muda a reserva

    let id_pag = cobranca.metadata?.id_pag;

    if (!id_pag && cobranca.payment_intent) {
        const idIntent = typeof cobranca.payment_intent === "string"
            ? cobranca.payment_intent
            : cobranca.payment_intent.id;
        const intent = await stripe().paymentIntents.retrieve(idIntent);
        id_pag = intent.metadata?.id_pag;
    }

    // Pagamentos de fatura não têm id_pag no metadata: são tratados no Dashboard
    if (!id_pag) return;

    const [rows] = await db.query("SELECT id_pag, id_agend FROM pagamentos WHERE id_pag = ?;", [id_pag]);
    if (rows.length === 0) return;

    const [resultado] = await db.query(
        "UPDATE pagamentos SET status_pag = 'estornado' WHERE id_pag = ? AND status_pag = 'pago';",
        [id_pag]
    );

    // Mesma regra do cancelamento feito pelo admin (pagamentos.js):
    // pagamento estornado -> agendamento volta a aguardar pagamento
    if (resultado.affectedRows > 0) {
        await db.query(
            "UPDATE agendamentos SET status_agend = 'pendente' WHERE id_agend = ? AND status_agend = 'confirmado';",
            [rows[0].id_agend]
        );
    }
}

// Busca o pagamento online e confere se ele é do usuário logado
async function buscarPagamentoDoUsuario(idSessao, id_usu) {
    const [rows] = await db.query(
        `
            SELECT
                p.id_pag,
                p.id_agend,
                p.valor_pag,
                p.forma_pag,
                p.status_pag,
                a.id_usu,
                a.status_agend,
                DATE_FORMAT(a.dt_agend, '%Y-%m-%d') AS dt_agend,
                TIME_FORMAT(a.hora_inicio, '%H:%i') AS hora_inicio,
                TIME_FORMAT(a.hora_fim, '%H:%i') AS hora_fim,
                q.nome_qd,
                q.tipo_qd
            FROM pagamentos p
            INNER JOIN agendamentos a ON a.id_agend = p.id_agend
            INNER JOIN quadras q ON q.id_qd = a.id_qd
            WHERE p.stripe_session_id = ?;
        `,
        [idSessao]
    );

    const pagamento = rows[0];
    if (!pagamento || Number(pagamento.id_usu) !== Number(id_usu)) return null;
    return pagamento;
}

function respostaPagamento(pagamento) {
    return {
        id_pag: pagamento.id_pag,
        status_pag: pagamento.status_pag,
        forma_pag: pagamento.forma_pag,
        valor_pag: Number(pagamento.valor_pag).toFixed(2),
        agendamento: {
            id_agend: pagamento.id_agend,
            status: pagamento.status_agend,
            quadra: pagamento.nome_qd,
            tipo: pagamento.tipo_qd,
            data: pagamento.dt_agend,
            horaInicio: pagamento.hora_inicio,
            horaFim: pagamento.hora_fim
        }
    };
}

async function validarSessaoDaRequisicao(request, response) {
    if (!stripe()) {
        stripeNaoConfigurado(response);
        return null;
    }

    const { sessionId } = request.params;

    if (!ID_SESSAO_VALIDO.test(String(sessionId))) {
        response.status(400).json({ sucesso: false, mensagem: "Sessão de pagamento inválida.", dados: null });
        return null;
    }

    const pagamento = await buscarPagamentoDoUsuario(sessionId, request.usuario.id_usu);

    if (!pagamento) {
        response.status(404).json({ sucesso: false, mensagem: "Pagamento não encontrado.", dados: null });
        return null;
    }

    return sessionId;
}

module.exports = {

    // Usados pelas faturas mensais (controllers/faturas.js)
    stripe,
    obterCustomer,
    paraCentavos,
    dataBR,

    // =====================================================
    // CRIAR CHECKOUT - POST /pagamentos/stripe/checkout
    // Body: { id_qd, dt_agend: "AAAA-MM-DD", hora_inicio: "HH:MM" }
    // O cliente vem da sessão (token), não do corpo da requisição.
    // =====================================================
    async criarCheckout(request, response) {
        const cliente = stripe();
        if (!cliente) return stripeNaoConfigurado(response);

        const usuario = request.usuario;
        const { id_qd, dt_agend, hora_inicio } = request.body || {};

        if (!id_qd || !dt_agend || !hora_inicio) {
            return response.status(400).json({
                sucesso: false,
                mensagem: "Campos obrigatórios: id_qd, dt_agend e hora_inicio.",
                dados: null
            });
        }

        if (!validarId(id_qd)) {
            return response.status(400).json({ sucesso: false, mensagem: "Quadra inválida.", dados: null });
        }

        const { erro, inicio, fim } = validarReservaCliente(dt_agend, hora_inicio);

        if (erro) {
            return response.status(400).json({ sucesso: false, mensagem: erro, dados: null });
        }

        let id_agend;
        let id_pag;
        let quadra;

        // Grava agendamento + pagamento pendentes numa transação.
        // O "FOR UPDATE" na quadra evita que duas pessoas reservem o
        // mesmo horário ao mesmo tempo.
        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const [quadras] = await conexao.query(
                "SELECT id_qd, nome_qd, tipo_qd, valor_qd, status_qd FROM quadras WHERE id_qd = ? FOR UPDATE;",
                [id_qd]
            );
            quadra = quadras[0];

            if (!quadra) {
                await conexao.rollback();
                return response.status(404).json({ sucesso: false, mensagem: "Quadra não encontrada.", dados: null });
            }

            if (quadra.status_qd !== "disponivel") {
                await conexao.rollback();
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Esta quadra está indisponível para agendamento.",
                    dados: null
                });
            }

            // O Stripe não aceita cobranças menores que R$ 0,50
            if (paraCentavos(quadra.valor_qd) < 50) {
                await conexao.rollback();
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Esta quadra não tem um valor válido para pagamento online.",
                    dados: null
                });
            }

            if (await existeConflito(id_qd, dt_agend, inicio, fim, 0, conexao)) {
                await conexao.rollback();
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Este horário acabou de ser reservado. Escolha outro horário.",
                    dados: null
                });
            }

            const [agendamento] = await conexao.query(
                `INSERT INTO agendamentos (id_qd, id_usu, dt_agend, hora_inicio, hora_fim, status_agend)
                 VALUES (?, ?, ?, ?, ?, 'pendente');`,
                [id_qd, usuario.id_usu, dt_agend, inicio, fim]
            );
            id_agend = agendamento.insertId;

            const [pagamento] = await conexao.query(
                `INSERT INTO pagamentos (id_agend, valor_pag, forma_pag, status_pag)
                 VALUES (?, ?, 'Online', 'pendente');`,
                [id_agend, quadra.valor_qd]
            );
            id_pag = pagamento.insertId;

            await conexao.commit();
        } catch (error) {
            await conexao.rollback().catch(() => {});
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        } finally {
            conexao.release();
        }

        // Liga o pagamento ao cliente no Stripe. Se não conseguir criar o
        // Customer, segue só com o e-mail para não travar a reserva.
        let identificacaoCliente;
        try {
            identificacaoCliente = { customer: await obterCustomer(usuario.id_usu) };
        } catch (error) {
            console.error("[stripe] Não foi possível obter o Customer:", error.message);
            identificacaoCliente = { customer_email: usuario.email_usu };
        }

        const dadosSessao = {
            mode: "payment",
            client_reference_id: String(id_pag),
            ...identificacaoCliente,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "brl",
                        unit_amount: paraCentavos(quadra.valor_qd),
                        product_data: {
                            name: `Reserva - ${quadra.nome_qd}`,
                            description: `${dataBR(dt_agend)}, das ${inicio.slice(0, 5)} às ${fim.slice(0, 5)}`
                        }
                    }
                }
            ],
            metadata: { id_pag: String(id_pag), id_agend: String(id_agend) },
            payment_intent_data: { metadata: { id_pag: String(id_pag), id_agend: String(id_agend) } },
            // Pix pendente expira junto com o prazo da reserva
            payment_method_options: { pix: { expires_after_seconds: MINUTOS_PARA_PAGAR * 60 } },
            expires_at: Math.floor(Date.now() / 1000) + MINUTOS_PARA_PAGAR * 60,
            success_url: `${urlFrontend()}/pagamento/retorno?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${urlFrontend()}/pagamento/retorno?session_id={CHECKOUT_SESSION_ID}&cancelado=1`
        };

        let sessao;

        try {
            try {
                sessao = await cliente.checkout.sessions.create(dadosSessao, {
                    idempotencyKey: `checkout-pagamento-${id_pag}`
                });
            } catch (error) {
                // Conta sem Pix ativado: tenta de novo sem as opções do Pix
                if (!String(error.param || "").startsWith("payment_method_options")) throw error;
                delete dadosSessao.payment_method_options;
                sessao = await cliente.checkout.sessions.create(dadosSessao, {
                    idempotencyKey: `checkout-pagamento-${id_pag}-sem-pix`
                });
            }

            await db.query("UPDATE pagamentos SET stripe_session_id = ? WHERE id_pag = ?;", [sessao.id, id_pag]);
        } catch (error) {
            // Não conseguiu abrir o pagamento: libera o horário
            await cancelarPendente({ id_pag, id_agend }).catch(() => {});
            console.error("[stripe] Erro ao criar Checkout:", error.message);

            return response.status(502).json({
                sucesso: false,
                mensagem: "Não foi possível iniciar o pagamento no Stripe. Tente novamente.",
                dados: null
            });
        }

        return response.status(201).json({
            sucesso: true,
            mensagem: "Sessão de pagamento criada.",
            dados: { url: sessao.url, id_pag, id_agend }
        });
    },


    // =====================================================
    // WEBHOOK - POST /webhooks/stripe
    // O Stripe avisa o backend quando o pagamento é concluído.
    // A assinatura garante que a chamada veio mesmo do Stripe.
    // (Esta rota recebe o corpo "cru", ver index.js)
    // =====================================================
    async webhook(request, response) {
        const cliente = stripe();
        const segredo = process.env.STRIPE_WEBHOOK_SECRET;

        if (!cliente || !segredo) {
            return response.status(503).json({ sucesso: false, mensagem: "Webhook do Stripe não configurado." });
        }

        let evento;

        try {
            evento = cliente.webhooks.constructEvent(request.body, request.headers["stripe-signature"], segredo);
        } catch (error) {
            return response.status(400).json({ sucesso: false, mensagem: `Assinatura inválida: ${error.message}` });
        }

        try {
            switch (evento.type) {
                case "checkout.session.completed":
                case "checkout.session.async_payment_succeeded":
                case "checkout.session.expired":
                    await sincronizarSessao(evento.data.object.id);
                    break;

                case "checkout.session.async_payment_failed":
                    await sincronizarSessao(evento.data.object.id, { falhou: true });
                    break;

                // Faturas mensais
                case "invoice.paid":
                    await sincronizarFaturaPaga(evento.data.object.id);
                    break;

                case "invoice.voided":
                    await cancelarFatura(evento.data.object.id);
                    break;

                case "invoice.payment_failed":
                    // O cliente pode tentar de novo na página da fatura; o Stripe
                    // manda os lembretes. Só registra para o admin acompanhar.
                    console.warn(`[stripe] Falha no pagamento da fatura ${evento.data.object.id}.`);
                    break;

                // Estorno feito pelo Dashboard do Stripe
                case "charge.refunded":
                    await sincronizarEstorno(evento.data.object);
                    break;

                default:
                    break;
            }

            return response.status(200).json({ recebido: true });
        } catch (error) {
            // Status 500 faz o Stripe reenviar o evento mais tarde
            console.error("[stripe] Erro ao processar webhook:", error.message);
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao processar o evento." });
        }
    },


    // =====================================================
    // CONSULTAR - GET /pagamentos/stripe/sessao/:sessionId
    // Usado pela tela de retorno. Também confirma o pagamento
    // consultando o Stripe, caso o webhook ainda não tenha chegado.
    // =====================================================
    async consultarSessao(request, response) {
        try {
            const sessionId = await validarSessaoDaRequisicao(request, response);
            if (!sessionId) return;

            await sincronizarSessao(sessionId);
            const pagamento = await buscarPagamentoDoUsuario(sessionId, request.usuario.id_usu);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Situação do pagamento.",
                dados: respostaPagamento(pagamento)
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // DESISTIR - POST /pagamentos/stripe/sessao/:sessionId/cancelar
    // Cliente voltou do Stripe sem pagar: encerra a sessão e libera o horário.
    // =====================================================
    async cancelarSessao(request, response) {
        try {
            const sessionId = await validarSessaoDaRequisicao(request, response);
            if (!sessionId) return;

            const sessao = await stripe().checkout.sessions.retrieve(sessionId);

            if (sessao.status === "open") {
                await stripe().checkout.sessions.expire(sessionId);
            }

            await sincronizarSessao(sessionId);
            const pagamento = await buscarPagamentoDoUsuario(sessionId, request.usuario.id_usu);

            return response.status(200).json({
                sucesso: true,
                mensagem: pagamento.status_pag === "pago"
                    ? "Este pagamento já foi aprovado."
                    : "Pagamento cancelado e horário liberado.",
                dados: respostaPagamento(pagamento)
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // Usado quando o CLIENTE cancela a própria reserva.
    // Pendente: encerra a sessão no Stripe (nada foi cobrado).
    // Pago: devolve o dinheiro no Stripe e marca como "estornado".
    async cancelarPagamentoOnline(pagamento) {
        const cliente = stripe();
        if (!cliente) throw new Error("STRIPE_SECRET_KEY não configurada.");

        const idSessao = pagamento.stripe_session_id;

        if (pagamento.status_pag === "pendente") {
            const sessao = await cliente.checkout.sessions.retrieve(idSessao);
            if (sessao.status === "open") await cliente.checkout.sessions.expire(idSessao);

            // Se o pagamento tiver sido concluído nesse meio-tempo, a
            // sincronização marca como pago e o estorno é feito abaixo.
            const atual = await sincronizarSessao(idSessao);
            if (atual?.status_pag !== "pago") {
                await cancelarPendente(pagamento);
                return "cancelado";
            }
        }

        await module.exports.estornarNoStripe(idSessao);
        await db.query(
            "UPDATE pagamentos SET status_pag = 'estornado' WHERE id_pag = ? AND status_pag = 'pago';",
            [pagamento.id_pag]
        );
        return "estornado";
    },


    // Usado pelo cancelamento de pagamentos (admin): devolve o dinheiro no Stripe
    async estornarNoStripe(idSessao) {
        const cliente = stripe();
        if (!cliente) throw new Error("STRIPE_SECRET_KEY não configurada.");

        const sessao = await cliente.checkout.sessions.retrieve(idSessao);
        const paymentIntent = typeof sessao.payment_intent === "string"
            ? sessao.payment_intent
            : sessao.payment_intent?.id;

        if (!paymentIntent) throw new Error("Pagamento não encontrado no Stripe.");

        return cliente.refunds.create(
            { payment_intent: paymentIntent },
            { idempotencyKey: `estorno-${idSessao}` }
        );
    }
};
