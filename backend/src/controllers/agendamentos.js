const db = require('../database/connection');

module.exports = {

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

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de agendamentos.',
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
                mensagem: 'Agendamento cadastrado com sucesso.',
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
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async editarAgendamentos(request, response) {
        try {

            const {
                id_agend,
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
                id_agend
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Agendamento atualizado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_agend,
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
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async apagarAgendamentos(request, response) {
        try {

            const { id_agend } = request.body;

            const sql = `
                DELETE FROM agendamentos
                WHERE id_agend = ?;
            `;

            const [resultado] = await db.query(sql, [id_agend]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Agendamento apagado com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_agend: id_agend
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