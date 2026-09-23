const db = require('../database/connection');

module.exports = {

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

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de participantes de equipe.',
                dados: dados
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

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
                mensagem: 'Participante de equipe cadastrado com sucesso.',
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
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async editarParticipantesEquipes(request, response) {
        try {

            const {
                id_part,
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
                id_part
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Participante de equipe atualizado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_part,
                    id_equipe,
                    id_usu,
                    dt_part,
                    status_part
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async apagarParticipantesEquipes(request, response) {
        try {

            const { id_part } = request.body;

            const sql = `
                DELETE FROM participantes_equipe
                WHERE id_part = ?;
            `;

            const [resultado] = await db.query(sql, [id_part]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Participante de equipe apagado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_part: id_part
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

};