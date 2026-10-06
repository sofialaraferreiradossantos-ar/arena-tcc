const db = require("../database/Connection");

module.exports = {

    // =====================================================
    // LISTAR PAGAMENTOS - GET
    // =====================================================
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

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de pagamentos.",
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
    // CADASTRAR PAGAMENTO - POST
    // =====================================================
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
                mensagem: "Pagamento cadastrado com sucesso.",
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
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR PAGAMENTO - PATCH
    // =====================================================
    async editarPagamentos(request, response) {
        try {

            const { id } = request.params;

            const {
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
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Pagamento não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Pagamento atualizado com sucesso.",
                dados: {
                    id_pag: id,
                    id_agend,
                    valor_pag,
                    forma_pag,
                    status_pag
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
    // CANCELAR PAGAMENTO - DELETE
    // =====================================================
    async apagarPagamentos(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE pagamentos
                SET status_pag = 'Pendente'
                WHERE id_pag = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Pagamento não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Pagamento cancelado com sucesso.",
                dados: {
                    id_pag: id
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
