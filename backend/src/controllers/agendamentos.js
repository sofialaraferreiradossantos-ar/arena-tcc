const db = require("../database/Connection");
const { validarId, validarData, validarHora } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");
const {
    normalizarHora,
    existeConflito,
    estaNoFuturo,
    validarReservaCliente
} = require("../utils/agendamento");
const { cancelarPagamentoOnline } = require("./stripe");
const { notificarAdmins } = require("../utils/notificacoes");

const STATUS_AGENDAMENTO = ["pendente", "confirmado", "cancelado"];

// Agendamento do cliente logado (null se não existir ou for de outra pessoa)
async function buscarAgendamentoDoCliente(id_agend, id_usu, conexao = db, bloquear = false) {
    const [rows] = await conexao.query(
        `
            SELECT
                id_agend,
                id_qd,
                DATE_FORMAT(dt_agend, '%Y-%m-%d') AS dt_agend,
                TIME_FORMAT(hora_inicio, '%H:%i:%s') AS hora_inicio,
                TIME_FORMAT(hora_fim, '%H:%i:%s') AS hora_fim,
                status_agend
            FROM agendamentos
            WHERE id_agend = ? AND id_usu = ?
            ${bloquear ? "FOR UPDATE" : ""};
        `,
        [id_agend, id_usu]
    );
    return rows[0] || null;
}

function erro(response, status, mensagem) {
    return response.status(status).json({ sucesso: false, mensagem, dados: null });
}

module.exports = {

    // =====================================================
    // LISTAR AGENDAMENTOS - GET
    // INNER JOIN pelas chaves estrangeiras: traz o nome da quadra
    // e o nome do cliente em vez de só os números (id_qd, id_usu).
    // =====================================================
    async listarAgendamentos(request, response) {
        try {

            const sql = `
                SELECT
                    a.id_agend,
                    DATE_FORMAT(a.dt_agend, '%Y-%m-%d') AS dt_agend,
                    TIME_FORMAT(a.hora_inicio, '%H:%i') AS hora_inicio,
                    TIME_FORMAT(a.hora_fim, '%H:%i') AS hora_fim,
                    a.status_agend,
                    q.id_qd,
                    q.nome_qd,
                    q.tipo_qd,
                    u.id_usu,
                    u.nome_usu,
                    u.email_usu
                FROM agendamentos a
                INNER JOIN quadras q ON q.id_qd = a.id_qd
                INNER JOIN usuarios u ON u.id_usu = a.id_usu
                ORDER BY a.dt_agend DESC, a.hora_inicio DESC;
            `;

            const [rows] = await db.query(sql);

            // Devolve os dados com os nomes dos campos tratados
            const dados = rows.map(agendamento => ({
                id: agendamento.id_agend,
                data: agendamento.dt_agend,
                horaInicio: agendamento.hora_inicio,
                horaFim: agendamento.hora_fim,
                status: agendamento.status_agend,
                quadra: {
                    id: agendamento.id_qd,
                    nome: agendamento.nome_qd,
                    tipo: agendamento.tipo_qd
                },
                cliente: {
                    id: agendamento.id_usu,
                    nome: agendamento.nome_usu,
                    email: agendamento.email_usu
                }
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de agendamentos.",
                items: dados.length,
                dados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // CADASTRAR AGENDAMENTO - POST
    // Todo agendamento começa "pendente" e é confirmado
    // quando o pagamento for registrado como "pago".
    // =====================================================
    async cadastrarAgendamentos(request, response) {
        try {

            const {
                id_qd,
                id_usu,
                dt_agend,
                hora_inicio,
                hora_fim,
                status_agend = "pendente"
            } = request.body || {};

            if (!id_qd || !id_usu || !dt_agend || !hora_inicio || !hora_fim) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: id_qd, id_usu, dt_agend, hora_inicio e hora_fim.",
                    dados: null
                });
            }

            if (!validarId(id_qd) || !validarId(id_usu)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Os campos id_qd e id_usu devem ser números.",
                    dados: null
                });
            }

            if (!validarData(dt_agend)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Data do agendamento inválida. Use o formato YYYY-MM-DD.",
                    dados: null
                });
            }

            if (dt_agend < new Date().toLocaleDateString("sv-SE")) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Não é possível agendar em uma data que já passou.",
                    dados: null
                });
            }

            if (!validarHora(hora_inicio) || !validarHora(hora_fim)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Horário inválido. Use o formato HH:MM.",
                    dados: null
                });
            }

            const inicio = normalizarHora(hora_inicio);
            const fim = normalizarHora(hora_fim);

            if (fim <= inicio) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "A hora de fim deve ser maior que a hora de início.",
                    dados: null
                });
            }

            if (!STATUS_AGENDAMENTO.includes(status_agend)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_AGENDAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            // Verificar se a quadra existe e está disponível
            const [quadraResult] = await db.query(
                "SELECT status_qd FROM quadras WHERE id_qd = ?;",
                [id_qd]
            );

            if (quadraResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Quadra não encontrada.",
                    dados: null
                });
            }

            if (quadraResult[0].status_qd !== "disponivel") {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Esta quadra está indisponível para agendamento.",
                    dados: null
                });
            }

            // Verificar se o usuário existe e está ativo
            const [usuarioResult] = await db.query(
                "SELECT id_usu FROM usuarios WHERE id_usu = ? AND status_usu = 'ativo';",
                [id_usu]
            );

            if (usuarioResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Usuário não encontrado ou inativo.",
                    dados: null
                });
            }

            // Verificar se o horário já está ocupado
            if (await existeConflito(id_qd, dt_agend, inicio, fim)) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe um agendamento nesta quadra nesse horário.",
                    dados: null
                });
            }

            const sql = `
                INSERT INTO agendamentos
                    (id_qd, id_usu, dt_agend, hora_inicio, hora_fim, status_agend)
                VALUES
                    (?, ?, ?, ?, ?, ?);
            `;

            const [resultado] = await db.query(sql, [id_qd, id_usu, dt_agend, inicio, fim, status_agend]);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Agendamento cadastrado com sucesso.",
                dados: {
                    id_agend: resultado.insertId,
                    id_qd: Number(id_qd),
                    id_usu: Number(id_usu),
                    dt_agend,
                    hora_inicio: inicio,
                    hora_fim: fim,
                    status_agend
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR AGENDAMENTO - PATCH (UPDATE DINÂMICO)
    // =====================================================
    async editarAgendamentos(request, response) {
        try {

            const { id } = request.params;
            const dados = { ...request.body };

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do agendamento deve ser numérico.",
                    dados: null
                });
            }

            const [atualRows] = await db.query(
                `
                    SELECT
                        id_qd,
                        DATE_FORMAT(dt_agend, '%Y-%m-%d') AS dt_agend,
                        TIME_FORMAT(hora_inicio, '%H:%i:%s') AS hora_inicio,
                        TIME_FORMAT(hora_fim, '%H:%i:%s') AS hora_fim,
                        status_agend
                    FROM agendamentos
                    WHERE id_agend = ?;
                `,
                [id]
            );

            if (atualRows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Agendamento com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            if (dados.dt_agend !== undefined && !validarData(dados.dt_agend)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Data do agendamento inválida. Use o formato YYYY-MM-DD.",
                    dados: null
                });
            }

            for (const campo of ["hora_inicio", "hora_fim"]) {
                if (dados[campo] !== undefined) {
                    if (!validarHora(dados[campo])) {
                        return response.status(400).json({
                            sucesso: false,
                            mensagem: "Horário inválido. Use o formato HH:MM.",
                            dados: null
                        });
                    }
                    dados[campo] = normalizarHora(dados[campo]);
                }
            }

            if (dados.status_agend !== undefined && !STATUS_AGENDAMENTO.includes(dados.status_agend)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_AGENDAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            const { setClauses, values } = montarUpdate(dados, {
                dt_agend: "dt_agend",
                hora_inicio: "hora_inicio",
                hora_fim: "hora_fim",
                status_agend: "status_agend"
            });

            if (setClauses.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum campo válido enviado para atualização.",
                    dados: null
                });
            }

            // Junta os dados atuais com os novos para validar o horário final
            const final = { ...atualRows[0], ...dados };

            if (final.hora_fim <= final.hora_inicio) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "A hora de fim deve ser maior que a hora de início.",
                    dados: null
                });
            }

            if (
                final.status_agend !== "cancelado" &&
                await existeConflito(final.id_qd, final.dt_agend, final.hora_inicio, final.hora_fim, id)
            ) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe um agendamento nesta quadra nesse horário.",
                    dados: null
                });
            }

            values.push(id);

            await db.query(
                `UPDATE agendamentos SET ${setClauses.join(", ")} WHERE id_agend = ?;`,
                values
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: "Agendamento atualizado com sucesso.",
                dados: { id_agend: Number(id) }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // CANCELAR AGENDAMENTO - DELETE
    // =====================================================
    async apagarAgendamentos(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do agendamento deve ser numérico.",
                    dados: null
                });
            }

            const sql = `
                UPDATE agendamentos
                SET status_agend = 'cancelado'
                WHERE id_agend = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Agendamento não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Agendamento cancelado com sucesso.",
                dados: {
                    id_agend: id
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // HORÁRIOS OCUPADOS - GET /agendamentos/ocupados?id_qd=1&dt_agend=AAAA-MM-DD
    // Público: devolve só os intervalos ocupados, sem dados dos clientes.
    // =====================================================
    async listarOcupados(request, response) {
        try {
            const { id_qd, dt_agend } = request.query;

            if (!validarId(id_qd) || !validarData(dt_agend)) {
                return erro(response, 400, "Informe id_qd e dt_agend (AAAA-MM-DD).");
            }

            const [rows] = await db.query(
                `
                    SELECT
                        TIME_FORMAT(hora_inicio, '%H:%i') AS inicio,
                        TIME_FORMAT(hora_fim, '%H:%i') AS fim
                    FROM agendamentos
                    WHERE id_qd = ?
                      AND dt_agend = ?
                      AND status_agend <> 'cancelado'
                    ORDER BY hora_inicio;
                `,
                [id_qd, dt_agend]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: "Horários ocupados.",
                items: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // MEUS AGENDAMENTOS - GET /agendamentos/meus (cliente logado)
    // =====================================================
    async listarMeus(request, response) {
        try {
            const [rows] = await db.query(
                `
                    SELECT
                        a.id_agend,
                        DATE_FORMAT(a.dt_agend, '%Y-%m-%d') AS dt_agend,
                        TIME_FORMAT(a.hora_inicio, '%H:%i') AS hora_inicio,
                        TIME_FORMAT(a.hora_fim, '%H:%i') AS hora_fim,
                        a.status_agend,
                        q.id_qd,
                        q.nome_qd,
                        q.tipo_qd,
                        (
                            SELECT p.status_pag
                            FROM pagamentos p
                            WHERE p.id_agend = a.id_agend
                            ORDER BY p.id_pag DESC
                            LIMIT 1
                        ) AS status_pag
                    FROM agendamentos a
                    INNER JOIN quadras q ON q.id_qd = a.id_qd
                    WHERE a.id_usu = ?
                      AND a.status_agend <> 'cancelado'
                    ORDER BY a.dt_agend, a.hora_inicio;
                `,
                [request.usuario.id_usu]
            );

            const dados = rows.map((agendamento) => ({
                id: agendamento.id_agend,
                data: agendamento.dt_agend,
                horaInicio: agendamento.hora_inicio,
                horaFim: agendamento.hora_fim,
                status: agendamento.status_agend,
                pagamento: agendamento.status_pag,
                quadra: {
                    id: agendamento.id_qd,
                    nome: agendamento.nome_qd,
                    tipo: agendamento.tipo_qd
                }
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: "Seus agendamentos.",
                items: dados.length,
                dados
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // REMARCAR - PATCH /agendamentos/meus/:id (cliente logado)
    // Body: { dt_agend, hora_inicio }. Só muda data/horário: a quadra
    // continua a mesma, então o valor pago continua correto.
    // =====================================================
    async remarcarMeu(request, response) {
        const { id } = request.params;
        const { dt_agend, hora_inicio } = request.body || {};

        if (!validarId(id)) return erro(response, 400, "O id do agendamento deve ser numérico.");

        const validacao = validarReservaCliente(dt_agend, hora_inicio);
        if (validacao.erro) return erro(response, 400, validacao.erro);

        const conexao = await db.getConnection();

        try {
            await conexao.beginTransaction();

            const atual = await buscarAgendamentoDoCliente(id, request.usuario.id_usu, conexao, true);

            if (!atual) {
                await conexao.rollback();
                return erro(response, 404, "Agendamento não encontrado.");
            }

            if (atual.status_agend !== "confirmado") {
                await conexao.rollback();
                return erro(response, 400, atual.status_agend === "pendente"
                    ? "Conclua o pagamento antes de remarcar."
                    : "Este agendamento foi cancelado.");
            }

            if (!estaNoFuturo(atual.dt_agend, atual.hora_inicio)) {
                await conexao.rollback();
                return erro(response, 400, "Não é possível remarcar uma reserva que já começou.");
            }

            // Trava a quadra para ninguém reservar o mesmo horário ao mesmo tempo
            const [quadras] = await conexao.query(
                "SELECT status_qd FROM quadras WHERE id_qd = ? FOR UPDATE;",
                [atual.id_qd]
            );

            if (quadras[0]?.status_qd !== "disponivel") {
                await conexao.rollback();
                return erro(response, 400, "Esta quadra está indisponível no momento.");
            }

            if (await existeConflito(atual.id_qd, dt_agend, validacao.inicio, validacao.fim, id, conexao)) {
                await conexao.rollback();
                return erro(response, 409, "Este horário já está ocupado. Escolha outro.");
            }

            await conexao.query(
                "UPDATE agendamentos SET dt_agend = ?, hora_inicio = ?, hora_fim = ? WHERE id_agend = ?;",
                [dt_agend, validacao.inicio, validacao.fim, id]
            );

            await conexao.commit();

            return response.status(200).json({
                sucesso: true,
                mensagem: "Agendamento remarcado com sucesso.",
                dados: {
                    id_agend: Number(id),
                    dt_agend,
                    hora_inicio: validacao.inicio.slice(0, 5),
                    hora_fim: validacao.fim.slice(0, 5)
                }
            });
        } catch (error) {
            await conexao.rollback().catch(() => {});
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        } finally {
            conexao.release();
        }
    },


    // =====================================================
    // CANCELAR - DELETE /agendamentos/meus/:id (cliente logado)
    // Pagamento online pendente: a cobrança é encerrada no Stripe.
    // Pagamento online pago: o valor é estornado automaticamente.
    // =====================================================
    async cancelarMeu(request, response) {
        try {
            const { id } = request.params;

            if (!validarId(id)) return erro(response, 400, "O id do agendamento deve ser numérico.");

            const agendamento = await buscarAgendamentoDoCliente(id, request.usuario.id_usu);

            if (!agendamento) return erro(response, 404, "Agendamento não encontrado.");
            if (agendamento.status_agend === "cancelado") return erro(response, 400, "Este agendamento já foi cancelado.");

            if (!estaNoFuturo(agendamento.dt_agend, agendamento.hora_inicio)) {
                return erro(response, 400, "Não é possível cancelar uma reserva que já começou.");
            }

            const [pagamentos] = await db.query(
                `SELECT id_pag, id_agend, status_pag, stripe_session_id, stripe_invoice_id
                 FROM pagamentos
                 WHERE id_agend = ? AND status_pag IN ('pendente', 'pago');`,
                [id]
            );

            // Reserva cobrada na fatura mensal: a fatura já tem o valor dela
            if (pagamentos.some((p) => p.stripe_invoice_id)) {
                return erro(response, 409, "Esta reserva está na sua fatura mensal. Para cancelar, fale com a recepção.");
            }

            // Pago no balcão (sem Stripe): o estorno precisa ser feito pela arena
            if (pagamentos.some((p) => !p.stripe_session_id && p.status_pag === "pago")) {
                return erro(response, 409, "Esta reserva foi paga na arena. Para cancelar, fale com a recepção.");
            }

            let estornado = false;

            for (const pagamento of pagamentos) {
                if (pagamento.stripe_session_id) {
                    try {
                        const resultado = await cancelarPagamentoOnline(pagamento);
                        if (resultado === "estornado") estornado = true;
                    } catch (error) {
                        console.error("[stripe] Erro ao cancelar pagamento:", error.message);
                        return erro(response, 502, "Não foi possível cancelar o pagamento no Stripe. Tente novamente.");
                    }
                } else {
                    await db.query(
                        "UPDATE pagamentos SET status_pag = 'cancelado' WHERE id_pag = ? AND status_pag = 'pendente';",
                        [pagamento.id_pag]
                    );
                }
            }

            await db.query("UPDATE agendamentos SET status_agend = 'cancelado' WHERE id_agend = ?;", [id]);

            // Reserva que estava confirmada: avisa os administradores que o
            // horário foi liberado (reserva só pendente não gera aviso)
            if (agendamento.status_agend === "confirmado") {
                const [[quadra]] = await db
                    .query("SELECT nome_qd FROM quadras WHERE id_qd = ?;", [agendamento.id_qd])
                    .catch(() => [[null]]);
                const [ano, mes, dia] = agendamento.dt_agend.split("-");

                await notificarAdmins({
                    tipo: "reserva_cancelada",
                    titulo: "Reserva cancelada pelo cliente",
                    mensagem: `${request.usuario.nome_usu} cancelou a reserva de ${quadra?.nome_qd ?? "quadra"} em ${dia}/${mes}/${ano} às ${agendamento.hora_inicio.slice(0, 5)}${estornado ? " (valor estornado)" : ""}. O horário está livre.`,
                    link: "/administrador/agendamentos"
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: estornado
                    ? "Reserva cancelada. O valor foi estornado e volta pela mesma forma de pagamento."
                    : "Reserva cancelada.",
                dados: { id_agend: Number(id), estornado }
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    }

};
