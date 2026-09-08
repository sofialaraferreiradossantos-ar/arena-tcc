const db = require('../database/connection');

module.exports = {

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
                ORDER BY id_disp;
            `;

            const [dados] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de disponibilidades.',
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
                mensagem: 'Disponibilidade cadastrada com sucesso.',
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
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async editarDisponibilidades(request, response) {
        try {

            const {
                id_disp,
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
                id_disp
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Disponibilidade atualizada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_disp,
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
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },

    async apagarDisponibilidades(request, response) {
        try {

            const { id_disp } = request.body;

            const sql = `
                DELETE FROM disponibilidades
                WHERE id_disp = ?;
            `;

            const [resultado] = await db.query(sql, [id_disp]);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Disponibilidade apagada com sucesso.',
                dados: {
                    linhasAfetadas: resultado.affectedRows,
                    id_disp: id_disp
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