const db = require("../database/connection");

module.exports = {

    // =====================================================
    // LISTAR AGENDAMENTOS - GET
    // =====================================================
    async listarAgendamentos(request, response) {
        try {

            const sql = `
                SELECT
                    id_agend,
                    id_qd,
                    id_usu,
                    dt_agend,
                    hora_inicio,
                    hora_fim,
                    status_agend
                FROM agendamentos
                ORDER BY id_agend;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de agendamentos.",
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
    // CADASTRAR AGENDAMENTO - POST
    // =====================================================
    async cadastrarAgendamentos(request, response) {
        try {

            const {
                id_qd,
                id_usu,
                dt_agend,
                hora_inicio,
                hora_fim,
                status_agend
            } = request.body;

            const sql = `
                INSERT INTO agendamentos
                    (id_qd, id_usu, dt_agend, hora_inicio, hora_fim, status_agend)
                VALUES
                    (?, ?, ?, ?, ?, ?);
            `;

            const valores = [
                id_qd,
                id_usu,
                dt_agend,
                hora_inicio,
                hora_fim,
                status_agend
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Agendamento cadastrado com sucesso.",
                dados: {
                    id_agend: resultado.insertId,
                    id_qd,
                    id_usu,
                    dt_agend,
                    hora_inicio,
                    hora_fim,
                    status_agend
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
    // EDITAR AGENDAMENTO - PATCH
    // =====================================================
    async editarAgendamentos(request, response) {
        try {

            const { id } = request.params;

            const {
                id_qd,
                id_usu,
                dt_agend,
                hora_inicio,
                hora_fim,
                status_agend
            } = request.body;

            const sql = `
                UPDATE agendamentos
                SET
                    id_qd = ?,
                    id_usu = ?,
                    dt_agend = ?,
                    hora_inicio = ?,
                    hora_fim = ?,
                    status_agend = ?
                WHERE id_agend = ?;
            `;

            const valores = [
                id_qd,
                id_usu,
                dt_agend,
                hora_inicio,
                hora_fim,
                status_agend,
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Agendamento não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Agendamento atualizado com sucesso.",
                dados: {
                    id_agend: id,
                    id_qd,
                    id_usu,
                    dt_agend,
                    hora_inicio,
                    hora_fim,
                    status_agend
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
    // CANCELAR AGENDAMENTO - DELETE
    // =====================================================
    async apagarAgendamentos(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE agendamentos
                SET status_agend = 'cancelado'
                WHERE id_agend = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Agendamento não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Agendamento cancelado com sucesso.",
                dados: {
                    id_agend: id
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