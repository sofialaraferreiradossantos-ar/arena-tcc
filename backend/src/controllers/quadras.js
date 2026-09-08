const db = require('../database/connection');

module.exports = {

    async listarQuadras(request, response) {
        try {

            const sql = `
                SELECT
                    id_qd,
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd
                FROM quadras
                ORDER BY id_qd;
            `;

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de quadras.',
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

    async cadastrarQuadras(request, response) {
        try {

            const {
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd
            } = request.body;

            const sql = `
                INSERT INTO quadras
                    (nome_qd, tipo_qd, desc_qd, status_qd, valor_qd)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

            const valores = [
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Quadra cadastrada com sucesso.',
                dados: {
                    id_qd: resultado.insertId,
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd
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

    async editarQuadras(request, response) {
        try {

            const {
                id_qd,
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd
            } = request.body;

            const sql = `
                UPDATE quadras
                SET
                    nome_qd = ?,
                    tipo_qd = ?,
                    desc_qd = ?,
                    status_qd = ?,
                    valor_qd = ?
                WHERE id_qd = ?;
            `;

            const valores = [
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd,
                id_qd
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quadra atualizada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_qd,
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd
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

    async apagarQuadras(request, response) {
        try {

            const { id_qd } = request.body;

            const sql = `
                DELETE FROM quadras
                WHERE id_qd = ?;
            `;

            const [resultado] = await db.query(sql, [id_qd]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quadra apagada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_qd: id_qd
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