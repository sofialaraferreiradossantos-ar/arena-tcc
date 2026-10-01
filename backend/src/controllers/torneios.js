const db = require("../database/connection");

module.exports = {

    // =====================================================
    // LISTAR TORNEIOS - GET
    // =====================================================
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

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de torneios.",
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
    // CADASTRAR TORNEIO - POST
    // =====================================================
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
                mensagem: "Torneio cadastrado com sucesso.",
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
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR TORNEIO - PATCH
    // =====================================================
    async editarTorneios(request, response) {
        try {

            const { id } = request.params;

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
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Torneio não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Torneio atualizado com sucesso.",
                dados: {
                    id_torn: id,
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
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // INATIVAR TORNEIO - DELETE
    // =====================================================
    async apagarTorneios(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE torneios
                SET status_torn = 'inativo'
                WHERE id_torn = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Torneio não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Torneio inativado com sucesso.",
                dados: {
                    id_torn: id
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