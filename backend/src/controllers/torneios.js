const db = require('../database/connection');

module.exports = {

    async listarTorneios(request, response) {
        try {

            const sql = `
                SELECT
                    id_torn,
                    nome_torn,
                    dt_torn,
                    desc_torn,
                    status_torn,
                    limite_part_torn,
                    premiacao,
                    dt_cad,
                    valor_part
                FROM torneios
                ORDER BY id_torn;
            `;

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de torneios.',
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

    async cadastrarTorneios(request, response) {
        try {

            const {
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                premiacao,
                dt_cad,
                valor_part
            } = request.body;

            const sql = `
                INSERT INTO torneios
                    (
                        nome_torn,
                        dt_torn,
                        desc_torn,
                        status_torn,
                        limite_part_torn,
                        premiacao,
                        dt_cad,
                        valor_part
                    )
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const valores = [
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                premiacao,
                dt_cad,
                valor_part
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Torneio cadastrado com sucesso.',
                dados: {
                    id_torn: resultado.insertId,
                    nome_torn,
                    dt_torn,
                    desc_torn,
                    status_torn,
                    limite_part_torn,
                    premiacao,
                    dt_cad,
                    valor_part
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

    async editarTorneios(request, response) {
        try {

            const {
                id_torn,
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                premiacao,
                dt_cad,
                valor_part
            } = request.body;

            const sql = `
                UPDATE torneios
                SET
                    nome_torn = ?,
                    dt_torn = ?,
                    desc_torn = ?,
                    status_torn = ?,
                    limite_part_torn = ?,
                    premiacao = ?,
                    dt_cad = ?,
                    valor_part = ?
                WHERE id_torn = ?;
            `;

            const valores = [
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                premiacao,
                dt_cad,
                valor_part,
                id_torn
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Torneio atualizado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_torn,
                    nome_torn,
                    dt_torn,
                    desc_torn,
                    status_torn,
                    limite_part_torn,
                    premiacao,
                    dt_cad,
                    valor_part
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

    async apagarTorneios(request, response) {
        try {

            const { id_torn } = request.body;

            const sql = `
                DELETE FROM torneios
                WHERE id_torn = ?;
            `;

            const [resultado] = await db.query(sql, [id_torn]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Torneio apagado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_torn: id_torn
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