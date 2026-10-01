const db = require("../database/connection");

module.exports = {

    // =====================================================
    // LISTAR DISPONIBILIDADES - GET
    // =====================================================
    async listarDisponibilidades(request, response) {
        try {

            const sql = `
                SELECT
                    id_disp,
                    id_qd,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    status_disp
                FROM disponibilidades
                WHERE status_disp = 'disponivel'
                ORDER BY id_disp;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de disponibilidades.",
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
    // CADASTRAR DISPONIBILIDADE - POST
    // =====================================================
    async cadastrarDisponibilidades(request, response) {
        try {

            const {
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp
            } = request.body;

            const sql = `
                INSERT INTO disponibilidades
                    (id_qd, dia_semana, hora_inicio, hora_fim, status_disp)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

            const valores = [
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Disponibilidade cadastrada com sucesso.",
                dados: {
                    id_disp: resultado.insertId,
                    id_qd,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    status_disp
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
    // EDITAR DISPONIBILIDADE - PATCH
    // =====================================================
    async editarDisponibilidades(request, response) {
        try {

            const { id } = request.params;

            const {
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp
            } = request.body;

            const sql = `
                UPDATE disponibilidades
                SET
                    id_qd = ?,
                    dia_semana = ?,
                    hora_inicio = ?,
                    hora_fim = ?,
                    status_disp = ?
                WHERE id_disp = ?;
            `;

            const valores = [
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp,
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Disponibilidade não encontrada.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Disponibilidade atualizada com sucesso.",
                dados: {
                    id_disp: id,
                    id_qd,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    status_disp
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
    // INATIVAR DISPONIBILIDADE - DELETE
    // =====================================================
    async apagarDisponibilidades(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE disponibilidades
                SET status_disp = 'indisponivel'
                WHERE id_disp = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Disponibilidade não encontrada.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Disponibilidade inativada com sucesso.",
                dados: {
                    id_disp: id
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