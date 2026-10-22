const db = require("../database/Connection");
const { validarId, validarData } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const STATUS_PARTICIPANTE = ["pendente", "confirmado", "cancelado"];

const SQL_BUSCAR_VINCULO = `
    SELECT
        id_part,
        id_equipe,
        id_usu,
        DATE_FORMAT(dt_part, '%Y-%m-%d') AS dt_part,
        status_part
    FROM participantes_equipe
    WHERE id_part = ?;
`;

module.exports = {

    // =====================================================
    // LISTAR PARTICIPANTES DE EQUIPES - GET
    // =====================================================
    async listarParticipantesEquipes(request, response) {
        try {

            const sql = `
                SELECT
                    id_part,
                    id_equipe,
                    id_usu,
                    dt_part,
                    status_part
                FROM participantes_equipe
                ORDER BY id_part;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de participantes de equipe.",
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
    // CADASTRAR PARTICIPANTE (VÍNCULO EQUIPE x USUÁRIO) - POST
    // =====================================================
    async cadastrarParticipantesEquipes(request, response) {
        try {

            const {
                id_equipe,
                id_usu,
                dt_part = new Date().toLocaleDateString("sv-SE"),
                status_part = "pendente"
            } = request.body || {};

            // Validação manual dos dados
            if (!id_equipe || !id_usu) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: id_equipe e id_usu.",
                    dados: null
                });
            }

            if (!validarId(id_equipe) || !validarId(id_usu)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Os campos id_equipe e id_usu devem ser números.",
                    dados: null
                });
            }

            if (!validarData(dt_part)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Data de participação inválida. Use o formato YYYY-MM-DD.",
                    dados: null
                });
            }

            if (!STATUS_PARTICIPANTE.includes(status_part)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_PARTICIPANTE.join(", ")}.`,
                    dados: null
                });
            }

            // Verificar se a equipe existe
            const [equipeResult] = await db.query(
                "SELECT id_equipe, id_torn FROM equipes_torneio WHERE id_equipe = ?;",
                [id_equipe]
            );

            if (equipeResult.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Equipe não encontrada.",
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

            // Verificar se o vínculo já existe
            const [check] = await db.query(
                "SELECT id_part FROM participantes_equipe WHERE id_equipe = ? AND id_usu = ?;",
                [id_equipe, id_usu]
            );

            if (check.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Este usuário já participa desta equipe.",
                    dados: null
                });
            }

            const [outraEquipe] = await db.query(
                `
                    SELECT pe.id_part
                    FROM participantes_equipe pe
                    INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
                    WHERE pe.id_usu = ? AND e.id_torn = ?;
                `,
                [id_usu, equipeResult[0].id_torn]
            );

            if (outraEquipe.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "Este usuário já está em outra equipe deste torneio.",
                    dados: null
                });
            }

            // Inserir registro
            const sql = `
                INSERT INTO participantes_equipe
                    (id_equipe, id_usu, dt_part, status_part)
                VALUES
                    (?, ?, ?, ?);
            `;

            const [resultado] = await db.query(sql, [id_equipe, id_usu, dt_part, status_part]);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Participante adicionado à equipe com sucesso.",
                dados: {
                    id_part: resultado.insertId,
                    id_equipe: Number(id_equipe),
                    id_usu: Number(id_usu),
                    dt_part,
                    status_part
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro ao adicionar participante na equipe.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR PARTICIPANTE - PATCH
    // O vínculo (equipe/usuário) não é alterado aqui: para trocar,
    // remova o participante e cadastre um novo. Só os atributos
    // do relacionamento (status e data) podem ser atualizados.
    // =====================================================
    async editarParticipantesEquipes(request, response) {
        try {

            const { id } = request.params;
            const dados = request.body || {};

            // Validação dos parâmetros
            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do participante deve ser numérico.",
                    dados: null
                });
            }

            if (dados.id_equipe !== undefined || dados.id_usu !== undefined) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O vínculo (equipe/usuário) não pode ser alterado. Remova o participante e cadastre novamente.",
                    dados: null
                });
            }

            // Verificar se o vínculo existe
            const [vinculo] = await db.query(SQL_BUSCAR_VINCULO, [id]);

            if (vinculo.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Participante não encontrado.",
                    dados: null
                });
            }

            // Validar e preparar campos para atualizar
            if (dados.status_part !== undefined && !STATUS_PARTICIPANTE.includes(dados.status_part)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: `O status deve ser: ${STATUS_PARTICIPANTE.join(", ")}.`,
                    dados: null
                });
            }

            if (dados.dt_part !== undefined && !validarData(dados.dt_part)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Data de participação inválida. Use o formato YYYY-MM-DD.",
                    dados: null
                });
            }

            const { setClauses, values } = montarUpdate(dados, {
                status_part: "status_part",
                dt_part: "dt_part"
            });

            if (setClauses.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum campo válido enviado. Campos permitidos: status_part e dt_part.",
                    dados: null
                });
            }

            values.push(id);

            await db.query(
                `UPDATE participantes_equipe SET ${setClauses.join(", ")} WHERE id_part = ?;`,
                values
            );

            // Buscar dados atualizados
            const [vinculoAtualizado] = await db.query(SQL_BUSCAR_VINCULO, [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Vínculo atualizado com sucesso.",
                dados: {
                    antigo: vinculo[0],
                    atualizado: vinculoAtualizado[0]
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro ao atualizar vínculo.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // REMOVER PARTICIPANTE DA EQUIPE - DELETE
    // =====================================================
    async apagarParticipantesEquipes(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do participante deve ser numérico.",
                    dados: null
                });
            }

            // Verificar se há vínculo para excluir
            const [vinculo] = await db.query(SQL_BUSCAR_VINCULO, [id]);

            if (vinculo.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Vínculo não encontrado.",
                    dados: null
                });
            }

            // Executar exclusão
            await db.query("DELETE FROM participantes_equipe WHERE id_part = ?;", [id]);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Vínculo removido com sucesso.",
                dados: vinculo[0] // retorna o que foi removido como confirmação
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro ao excluir vínculo.",
                dados: error.message
            });

        }
    }

};
