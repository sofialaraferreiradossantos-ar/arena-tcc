const db = require('../database/connection');

module.exports = {

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

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de equipes de torneios.',
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

    async cadastrarEquipesTorneios(request, response) {
        try {

            const {
                id_torn,
                nome_equipe,
                desc_equipe,
                status_equipe
            } = request.body;

            const sql = `
                INSERT INTO equipes_torneio
                    (id_torn, nome_equipe, desc_equipe, status_equipe)
                VALUES
                    (?, ?, ?, ?);
            `;

            const valores = [
                id_torn,
                nome_equipe,
                desc_equipe,
                status_equipe
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Equipe de torneio cadastrada com sucesso.',
                dados: {
                    id_equipe: resultado.insertId,
                    id_torn,
                    nome_equipe,
                    desc_equipe,
                    status_equipe
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

    async editarEquipesTorneios(request, response) {
        try {

            const {
                id_equipe,
                id_torn,
                nome_equipe,
                desc_equipe,
                status_equipe
            } = request.body;

            const sql = `
                UPDATE equipes_torneio
                SET
                    id_torn = ?,
                    nome_equipe = ?,
                    desc_equipe = ?,
                    status_equipe = ?
                WHERE id_equipe = ?;
            `;

            const valores = [
                id_torn,
                nome_equipe,
                desc_equipe,
                status_equipe,
                id_equipe
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Equipe de torneio atualizada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_equipe,
                    id_torn,
                    nome_equipe,
                    desc_equipe,
                    status_equipe
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

    async apagarEquipesTorneios(request, response) {
        try {

            const { id_equipe } = request.body;

            const sql = `
                DELETE FROM equipes_torneio
                WHERE id_equipe = ?;
            `;

            const [resultado] = await db.query(sql, [id_equipe]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Equipe de torneio apagada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_equipe: id_equipe
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