const db = require('../database/connection');

module.exports = {

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

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de pagamentos.',
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

    async cadastrarPagamentos(request, response) {
        try {

            const {
                id_agend,
                valor_pag,
                forma_pag,
                status_pag
            } = request.body;

            const sql = `
                INSERT INTO pagamentos
                    (id_agend, valor_pag, forma_pag, status_pag)
                VALUES
                    (?, ?, ?, ?);
            `;

            const valores = [
                id_agend,
                valor_pag,
                forma_pag,
                status_pag
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Pagamento cadastrado com sucesso.',
                dados: {
                    id_pag: resultado.insertId,
                    id_agend,
                    valor_pag,
                    forma_pag,
                    status_pag
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

    async editarPagamentos(request, response) {
        try {

            const {
                id_pag,
                id_agend,
                valor_pag,
                forma_pag,
                status_pag
            } = request.body;

            const sql = `
                UPDATE pagamentos
                SET
                    id_agend = ?,
                    valor_pag = ?,
                    forma_pag = ?,
                    status_pag = ?
                WHERE id_pag = ?;
            `;

            const valores = [
                id_agend,
                valor_pag,
                forma_pag,
                status_pag,
                id_pag
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Pagamento atualizado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_pag,
                    id_agend,
                    valor_pag,
                    forma_pag,
                    status_pag
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

    async apagarPagamentos(request, response) {
        try {

            const { id_pag } = request.body;

            const sql = `
                DELETE FROM pagamentos
                WHERE id_pag = ?;
            `;

            const [resultado] = await db.query(sql, [id_pag]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Pagamento apagado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_pag: id_pag
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