const db = require("../database/Connection");
const { validarId, validarData, validarHora } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const STATUS_AGENDAMENTO = ["pendente", "confirmado", "cancelado"];

// "09:00" -> "09:00:00", para comparar horários como texto
function normalizarHora(hora) {
    return String(hora).length === 5 ? `${hora}:00` : String(hora);
}

// Existe outro agendamento ativo na mesma quadra e data com horário sobreposto?
async function existeConflito(id_qd, dt_agend, hora_inicio, hora_fim, ignorarId = 0) {
    const [rows] = await db.query(
        `
            SELECT id_agend
            FROM agendamentos
            WHERE id_qd = ?
              AND dt_agend = ?
              AND status_agend <> 'cancelado'
              AND id_agend <> ?
              AND hora_inicio < ?
              AND hora_fim > ?;
        `,
        [id_qd, dt_agend, ignorarId, hora_fim, hora_inicio]
    );
    return rows.length > 0;
}

module.exports = {

    // =====================================================
    // LISTAR AGENDAMENTOS - GET
    // =====================================================
    async listarAgendamentos(request, response) {
        try {

            const sql = `
                SELECT
                    id_agend,
                    id_qd,
                    id_usu,
                    dt_agend,
                    hora_inicio,
                    hora_fim,
                    status_agend
                FROM agendamentos
                ORDER BY id_agend;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de agendamentos.",
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
    }

};
