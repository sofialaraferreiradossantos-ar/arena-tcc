const db = require("../database/Connection");

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
    // CADASTRAR PARTICIPANTE - POST
    // =====================================================
    async cadastrarParticipantesEquipes(request, response) {
        try {

            const {
                id_equipe,
                id_usu,
                dt_part,
                status_part
            } = request.body;

            const sql = `
                INSERT INTO participantes_equipe
                    (id_equipe, id_usu, dt_part, status_part)
                VALUES
                    (?, ?, ?, ?);
            `;

            const valores = [
                id_equipe,
                id_usu,
                dt_part,
                status_part
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Participante de equipe cadastrado com sucesso.",
                dados: {
                    id_part: resultado.insertId,
                    id_equipe,
                    id_usu,
                    dt_part,
                    status_part
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
    // EDITAR PARTICIPANTE - PATCH
    // =====================================================
    async editarParticipantesEquipes(request, response) {
        try {

            const { id } = request.params;

            const {
                id_equipe,
                id_usu,
                dt_part,
                status_part
            } = request.body;

            const sql = `
                UPDATE participantes_equipe
                SET
                    id_equipe = ?,
                    id_usu = ?,
                    dt_part = ?,
                    status_part = ?
                WHERE id_part = ?;
            `;

            const valores = [
                id_equipe,
                id_usu,
                dt_part,
                status_part,
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Participante não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Participante de equipe atualizado com sucesso.",
                dados: {
                    id_part: id,
                    id_equipe,
                    id_usu,
                    dt_part,
                    status_part
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
    // INATIVAR PARTICIPANTE - DELETE
    // =====================================================
    async apagarParticipantesEquipes(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE participantes_equipe
                SET status_part = 'inativo'
                WHERE id_part = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Participante não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Participante inativado com sucesso.",
                dados: {
                    id_part: id
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
