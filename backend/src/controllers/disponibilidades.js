const db = require("../database/Connection");
const { validarId, validarHora } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const DIAS_SEMANA = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];
const STATUS_DISPONIBILIDADE = ["disponivel", "indisponivel"];

// "09:00" -> "09:00:00", para comparar horários como texto
function normalizarHora(hora) {
    return String(hora).length === 5 ? `${hora}:00` : String(hora);
}

// Valida só os campos presentes (serve para cadastro e edição).
// Retorna a mensagem de erro ou null se estiver tudo certo.
function validarCamposDisponibilidade(dados) {
    if (dados.dia_semana !== undefined && !DIAS_SEMANA.includes(dados.dia_semana)) {
        return `O dia da semana deve ser: ${DIAS_SEMANA.join(", ")}.`;
    }
    if ((dados.hora_inicio !== undefined && !validarHora(dados.hora_inicio)) ||
        (dados.hora_fim !== undefined && !validarHora(dados.hora_fim))) {
        return "Horário inválido. Use o formato HH:MM.";
    }
    if (dados.status_disp !== undefined && !STATUS_DISPONIBILIDADE.includes(dados.status_disp)) {
        return "O status deve ser 'disponivel' ou 'indisponivel'.";
    }
    return null;
}

// Existe outra disponibilidade da mesma quadra, no mesmo dia, com horário sobreposto?
async function existeSobreposicao(id_qd, dia_semana, hora_inicio, hora_fim, ignorarId = 0) {
    const [rows] = await db.query(
        `
            SELECT id_disp
            FROM disponibilidades
            WHERE id_qd = ?
              AND dia_semana = ?
              AND id_disp <> ?
              AND hora_inicio < ?
              AND hora_fim > ?;
        `,
        [id_qd, dia_semana, ignorarId, hora_fim, hora_inicio]
    );
    return rows.length > 0;
}

module.exports = {

    // =====================================================
    // LISTAR DISPONIBILIDADES - GET
    // =====================================================
    async listarDisponibilidades(request, response) {
        try {

            const sql = `
                SELECT
                    id_disp,
                    id_qd,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    status_disp
                FROM disponibilidades
                WHERE status_disp = 'disponivel'
                ORDER BY id_disp;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de disponibilidades.",
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
    // CADASTRAR DISPONIBILIDADE - POST
    // =====================================================
    async cadastrarDisponibilidades(request, response) {
        try {

            const {
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp = "disponivel"
            } = request.body || {};

            if (!id_qd || !dia_semana || !hora_inicio || !hora_fim) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: id_qd, dia_semana, hora_inicio e hora_fim.",
                    dados: null
                });
            }

            if (!validarId(id_qd)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O campo id_qd deve ser numérico.",
                    dados: null
                });
            }

            const erro = validarCamposDisponibilidade({ dia_semana, hora_inicio, hora_fim, status_disp });
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
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

            // Verificar se a quadra existe
            const [quadraResult] = await db.query("SELECT id_qd FROM quadras WHERE id_qd = ?;", [id_qd]);

            if (quadraResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Quadra não encontrada.",
                    dados: null
                });
            }

            if (await existeSobreposicao(id_qd, dia_semana, inicio, fim)) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe uma disponibilidade desta quadra nesse dia e horário.",
                    dados: null
                });
            }

            const sql = `
                INSERT INTO disponibilidades
                    (id_qd, dia_semana, hora_inicio, hora_fim, status_disp)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

            const [resultado] = await db.query(sql, [id_qd, dia_semana, inicio, fim, status_disp]);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Disponibilidade cadastrada com sucesso.",
                dados: {
                    id_disp: resultado.insertId,
                    id_qd: Number(id_qd),
                    dia_semana,
                    hora_inicio: inicio,
                    hora_fim: fim,
                    status_disp
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
    // EDITAR DISPONIBILIDADE - PATCH (UPDATE DINÂMICO)
    // =====================================================
    async editarDisponibilidades(request, response) {
        try {

            const { id } = request.params;
            const dados = { ...request.body };

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id da disponibilidade deve ser numérico.",
                    dados: null
                });
            }

            const erro = validarCamposDisponibilidade(dados);
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
                    dados: null
                });
            }

            const [atualRows] = await db.query(
                `
                    SELECT
                        id_qd,
                        dia_semana,
                        TIME_FORMAT(hora_inicio, '%H:%i:%s') AS hora_inicio,
                        TIME_FORMAT(hora_fim, '%H:%i:%s') AS hora_fim
                    FROM disponibilidades
                    WHERE id_disp = ?;
                `,
                [id]
            );

            if (atualRows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Disponibilidade com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            if (dados.hora_inicio !== undefined) dados.hora_inicio = normalizarHora(dados.hora_inicio);
            if (dados.hora_fim !== undefined) dados.hora_fim = normalizarHora(dados.hora_fim);

            // A disponibilidade continua na mesma quadra (id_qd não é editável)
            const { setClauses, values } = montarUpdate(dados, {
                dia_semana: "dia_semana",
                hora_inicio: "hora_inicio",
                hora_fim: "hora_fim",
                status_disp: "status_disp"
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

            if (await existeSobreposicao(final.id_qd, final.dia_semana, final.hora_inicio, final.hora_fim, id)) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe uma disponibilidade desta quadra nesse dia e horário.",
                    dados: null
                });
            }

            values.push(id);

            await db.query(
                `UPDATE disponibilidades SET ${setClauses.join(", ")} WHERE id_disp = ?;`,
                values
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: "Disponibilidade atualizada com sucesso.",
                dados: { id_disp: Number(id) }
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
    // INATIVAR DISPONIBILIDADE - DELETE
    // =====================================================
    async apagarDisponibilidades(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id da disponibilidade deve ser numérico.",
                    dados: null
                });
            }

            const sql = `
                UPDATE disponibilidades
                SET status_disp = 'indisponivel'
                WHERE id_disp = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Disponibilidade não encontrada.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Disponibilidade inativada com sucesso.",
                dados: {
                    id_disp: id
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
