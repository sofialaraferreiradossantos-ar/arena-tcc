const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const FORMAS_PAGAMENTO = ["Pix", "Cartão", "Dinheiro"];
const STATUS_PAGAMENTO = ["pendente", "pago", "estornado"];

// Regra de negócio: pagamento "pago" confirma o agendamento
async function confirmarAgendamento(id_agend) {
    await db.query(
        "UPDATE agendamentos SET status_agend = 'confirmado' WHERE id_agend = ?;",
        [id_agend]
    );
}

module.exports = {

    // =====================================================
    // LISTAR PAGAMENTOS - GET
    // =====================================================
    async listarPagamentos(request, response) {
        try {

            const sql = `
                SELECT
                    id_pag,
                    id_agend,
                    valor_pag,
                    forma_pag,
                    status_pag
                FROM pagamentos
                ORDER BY id_pag;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de pagamentos.",
                items: rows.length,
                dados: rows
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
    // CADASTRAR PAGAMENTO - POST
    // Quando o pagamento é registrado como "pago", o agendamento
    // correspondente é atualizado para "confirmado".
    // =====================================================
    async cadastrarPagamentos(request, response) {
        try {

            const {
                id_agend,
                valor_pag,
                forma_pag,
                status_pag = "pendente"
            } = request.body || {};

            if (!id_agend || valor_pag === undefined || !forma_pag) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: id_agend, valor_pag e forma_pag.",
                    dados: null
                });
            }

            if (!validarId(id_agend)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O campo id_agend deve ser numérico.",
                    dados: null
                });
            }

            const valor = Number.parseFloat(valor_pag);
            if (!Number.isFinite(valor) || valor <= 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O valor do pagamento deve ser um número maior que zero.",
                    dados: null
                });
            }

            if (!FORMAS_PAGAMENTO.includes(forma_pag)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `A forma de pagamento deve ser: ${FORMAS_PAGAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            if (!STATUS_PAGAMENTO.includes(status_pag)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_PAGAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            // Verificar se o agendamento existe
            const [agendResult] = await db.query(
                "SELECT status_agend FROM agendamentos WHERE id_agend = ?;",
                [id_agend]
            );

            if (agendResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Agendamento não encontrado.",
                    dados: null
                });
            }

            if (agendResult[0].status_agend === "cancelado") {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Não é possível registrar pagamento de um agendamento cancelado.",
                    dados: null
                });
            }

            // Verificar se o agendamento já foi pago
            const [pagoResult] = await db.query(
                "SELECT id_pag FROM pagamentos WHERE id_agend = ? AND status_pag = 'pago';",
                [id_agend]
            );

            if (pagoResult.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Este agendamento já está pago.",
                    dados: null
                });
            }

            const sql = `
                INSERT INTO pagamentos
                    (id_agend, valor_pag, forma_pag, status_pag)
                VALUES
                    (?, ?, ?, ?);
            `;

            const [resultado] = await db.query(sql, [id_agend, valor, forma_pag, status_pag]);

            // Pagamento confirmado -> agendamento confirmado
            if (status_pag === "pago") {
                await confirmarAgendamento(id_agend);
            }

            return response.status(201).json({
                sucesso: true,
                mensagem: status_pag === "pago"
                    ? `Pagamento registrado e agendamento ${id_agend} confirmado.`
                    : "Pagamento cadastrado com sucesso.",
                dados: {
                    id_pag: resultado.insertId,
                    id_agend: Number(id_agend),
                    valor_pag: valor.toFixed(2),
                    forma_pag,
                    status_pag
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
    // EDITAR PAGAMENTO - PATCH (UPDATE DINÂMICO)
    // =====================================================
    async editarPagamentos(request, response) {
        try {

            const { id } = request.params;
            const dados = { ...request.body };

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do pagamento deve ser numérico.",
                    dados: null
                });
            }

            const [pagamento] = await db.query(
                "SELECT id_agend FROM pagamentos WHERE id_pag = ?;",
                [id]
            );

            if (pagamento.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Pagamento com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            if (dados.valor_pag !== undefined) {
                dados.valor_pag = Number.parseFloat(dados.valor_pag);
                if (!Number.isFinite(dados.valor_pag) || dados.valor_pag <= 0) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: "O valor do pagamento deve ser um número maior que zero.",
                        dados: null
                    });
                }
            }

            if (dados.forma_pag !== undefined && !FORMAS_PAGAMENTO.includes(dados.forma_pag)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `A forma de pagamento deve ser: ${FORMAS_PAGAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            if (dados.status_pag !== undefined && !STATUS_PAGAMENTO.includes(dados.status_pag)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_PAGAMENTO.join(", ")}.`,
                    dados: null
                });
            }

            // O pagamento continua ligado ao mesmo agendamento (id_agend não é editável)
            const { setClauses, values } = montarUpdate(dados, {
                valor_pag: "valor_pag",
                forma_pag: "forma_pag",
                status_pag: "status_pag"
            });

            if (setClauses.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum campo válido enviado para atualização.",
                    dados: null
                });
            }

            values.push(id);

            await db.query(
                `UPDATE pagamentos SET ${setClauses.join(", ")} WHERE id_pag = ?;`,
                values
            );

            if (dados.status_pag === "pago") {
                await confirmarAgendamento(pagamento[0].id_agend);
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: dados.status_pag === "pago"
                    ? `Pagamento atualizado e agendamento ${pagamento[0].id_agend} confirmado.`
                    : "Pagamento atualizado com sucesso.",
                dados: { id_pag: Number(id) }
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
    // CANCELAR PAGAMENTO - DELETE
    // O pagamento vira "estornado". Se ele estava "pago", o
    // agendamento volta para "pendente" (regra inversa do cadastro).
    // =====================================================
    async apagarPagamentos(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do pagamento deve ser numérico.",
                    dados: null
                });
            }

            const [pagamento] = await db.query(
                "SELECT id_agend, status_pag FROM pagamentos WHERE id_pag = ?;",
                [id]
            );

            if (pagamento.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Pagamento não encontrado.",
                    dados: null
                });
            }

            const { id_agend, status_pag } = pagamento[0];

            if (status_pag === "estornado") {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Este pagamento já foi cancelado.",
                    dados: null
                });
            }

            await db.query(
                "UPDATE pagamentos SET status_pag = 'estornado' WHERE id_pag = ?;",
                [id]
            );

            // Pagamento pago cancelado -> agendamento volta a aguardar pagamento
            if (status_pag === "pago") {
                await db.query(
                    "UPDATE agendamentos SET status_agend = 'pendente' WHERE id_agend = ? AND status_agend = 'confirmado';",
                    [id_agend]
                );
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: status_pag === "pago"
                    ? `Pagamento cancelado e agendamento ${id_agend} voltou para pendente.`
                    : "Pagamento cancelado com sucesso.",
                dados: {
                    id_pag: Number(id),
                    id_agend,
                    status_pag: "estornado"
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    }

};
