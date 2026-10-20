const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const STATUS_EQUIPE = ["inscrita", "confirmada", "eliminada", "inativo"];

// Valida só os campos presentes (serve para cadastro e edição).
// Retorna a mensagem de erro ou null se estiver tudo certo.
function validarCamposEquipe(dados) {
    const tamanho = (valor) => String(valor ?? "").trim().length;

    if (dados.nome_equipe !== undefined && (tamanho(dados.nome_equipe) === 0 || tamanho(dados.nome_equipe) > 100)) {
        return "O nome da equipe deve ter entre 1 e 100 caracteres.";
    }
    if (dados.desc_equipe !== undefined && (tamanho(dados.desc_equipe) === 0 || tamanho(dados.desc_equipe) > 300)) {
        return "A descrição deve ter entre 1 e 300 caracteres.";
    }
    if (dados.status_equipe !== undefined && !STATUS_EQUIPE.includes(dados.status_equipe)) {
        return `O status deve ser: ${STATUS_EQUIPE.join(", ")}.`;
    }
    return null;
}

// Já existe outra equipe com esse nome no mesmo torneio?
async function nomeEmUso(id_torn, nome_equipe, ignorarId = 0) {
    const [rows] = await db.query(
        "SELECT id_equipe FROM equipes_torneio WHERE id_torn = ? AND nome_equipe = ? AND id_equipe <> ?;",
        [id_torn, String(nome_equipe).trim(), ignorarId]
    );
    return rows.length > 0;
}

module.exports = {

    // =====================================================
    // LISTAR EQUIPES DE TORNEIOS - GET
    // =====================================================
    async listarEquipesTorneios(request, response) {
        try {

            const sql = `
                SELECT
                    id_equipe,
                    id_torn,
                    nome_equipe,
                    desc_equipe,
                    status_equipe
                FROM equipes_torneio
                ORDER BY id_equipe;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de equipes de torneios.",
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
    // CADASTRAR EQUIPE DE TORNEIO - POST
    // =====================================================
    async cadastrarEquipesTorneios(request, response) {
        try {

            const {
                id_torn,
                nome_equipe,
                desc_equipe,
                status_equipe = "inscrita"
            } = request.body || {};

            if (!id_torn || !nome_equipe || !desc_equipe) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: id_torn, nome_equipe e desc_equipe.",
                    dados: null
                });
            }

            if (!validarId(id_torn)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O campo id_torn deve ser numérico.",
                    dados: null
                });
            }

            const erro = validarCamposEquipe({ nome_equipe, desc_equipe, status_equipe });
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
                    dados: null
                });
            }

            // Verificar se o torneio existe e aceita equipes
            const [torneioResult] = await db.query(
                "SELECT status_torn FROM torneios WHERE id_torn = ?;",
                [id_torn]
            );

            if (torneioResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Torneio não encontrado.",
                    dados: null
                });
            }

            if (["encerrado", "inativo"].includes(torneioResult[0].status_torn)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Este torneio não aceita novas equipes.",
                    dados: null
                });
            }

            if (await nomeEmUso(id_torn, nome_equipe)) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe uma equipe com esse nome neste torneio.",
                    dados: null
                });
            }

            const sql = `
                INSERT INTO equipes_torneio
                    (id_torn, nome_equipe, desc_equipe, status_equipe)
                VALUES
                    (?, ?, ?, ?);
            `;

            const valores = [id_torn, String(nome_equipe).trim(), String(desc_equipe).trim(), status_equipe];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Equipe de torneio cadastrada com sucesso.",
                dados: {
                    id_equipe: resultado.insertId,
                    id_torn: Number(id_torn),
                    nome_equipe: valores[1],
                    desc_equipe: valores[2],
                    status_equipe
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
    // EDITAR EQUIPE DE TORNEIO - PATCH (UPDATE DINÂMICO)
    // =====================================================
    async editarEquipesTorneios(request, response) {
        try {

            const { id } = request.params;
            const dados = request.body || {};

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id da equipe deve ser numérico.",
                    dados: null
                });
            }

            const erro = validarCamposEquipe(dados);
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
                    dados: null
                });
            }

            const [equipe] = await db.query(
                "SELECT id_torn FROM equipes_torneio WHERE id_equipe = ?;",
                [id]
            );

            if (equipe.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Equipe com ID ${id} não encontrada.`,
                    dados: null
                });
            }

            if (dados.nome_equipe !== undefined && await nomeEmUso(equipe[0].id_torn, dados.nome_equipe, id)) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Já existe uma equipe com esse nome neste torneio.",
                    dados: null
                });
            }

            // A equipe continua no mesmo torneio (id_torn não é editável)
            const { setClauses, values } = montarUpdate(dados, {
                nome_equipe: "nome_equipe",
                desc_equipe: "desc_equipe",
                status_equipe: "status_equipe"
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
                `UPDATE equipes_torneio SET ${setClauses.join(", ")} WHERE id_equipe = ?;`,
                values
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: "Equipe de torneio atualizada com sucesso.",
                dados: { id_equipe: Number(id) }
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
    // INATIVAR EQUIPE DE TORNEIO - DELETE
    // =====================================================
    async apagarEquipesTorneios(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id da equipe deve ser numérico.",
                    dados: null
                });
            }

            const sql = `
                UPDATE equipes_torneio
                SET status_equipe = 'inativo'
                WHERE id_equipe = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Equipe de torneio não encontrada.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Equipe de torneio inativada com sucesso.",
                dados: {
                    id_equipe: id
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
