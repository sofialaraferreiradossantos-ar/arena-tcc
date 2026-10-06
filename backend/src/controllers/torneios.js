const db = require("../database/Connection");

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
    },

    // INNER JOIN da relação N:N: torneio -> equipes -> usuários.
    async listarParticipantesDoTorneio(request, response) {
        try {
            const { id } = request.params;
            const [torneios] = await db.query(`
                SELECT id_torn, nome_torn, dt_torn, status_torn, limite_part_torn
                FROM torneios
                WHERE id_torn = ?;
            `, [id]);

            if (!torneios.length) {
                return response.status(404).json({ sucesso: false, mensagem: "Torneio não encontrado.", dados: null });
            }

            const [rows] = await db.query(`
                SELECT
                    e.id_equipe AS id_equipe,
                    e.nome_equipe AS nome_equipe,
                    e.status_equipe AS status_equipe,
                    u.id_usu AS id_usuario,
                    u.nome_usu AS nome_usuario,
                    u.email_usu AS email_usuario,
                    pe.dt_part AS data_participacao,
                    pe.status_part AS status_participacao
                FROM equipes_torneio e
                INNER JOIN participantes_equipe pe ON pe.id_equipe = e.id_equipe
                INNER JOIN usuarios u ON u.id_usu = pe.id_usu
                WHERE e.id_torn = ?
                ORDER BY e.id_equipe, u.nome_usu;
            `, [id]);

            const equipes = [];
            for (const row of rows) {
                let equipe = equipes.find((item) => item.id === row.id_equipe);
                if (!equipe) {
                    equipe = {
                        id: row.id_equipe,
                        nome: row.nome_equipe,
                        status: row.status_equipe,
                        participantes: []
                    };
                    equipes.push(equipe);
                }
                equipe.participantes.push({
                    id: row.id_usuario,
                    nome: row.nome_usuario,
                    email: row.email_usuario,
                    dataParticipacao: row.data_participacao,
                    status: row.status_participacao
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Participantes do torneio.",
                dados: { ...torneios[0], equipes }
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar participantes do torneio.", dados: error.message });
        }
    }

};
