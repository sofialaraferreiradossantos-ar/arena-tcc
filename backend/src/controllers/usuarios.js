const db = require('../database/connection');

module.exports = {

    // =====================================================
    // LISTAR USUÁRIOS - GET
    // =====================================================
    async listarUsuarios(request, response) {
        try {

            const sql = `
                SELECT
                    id_usu,
                    nome_usu,
                    email_usu,
                    senha_usu,
                    status_usu,
                    dt_cad
                FROM usuarios
                 WHERE status_usu = 'ativo'
                ORDER BY id_usu;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                items: rows.length,
                dados: rows
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // =====================================================
    // CADASTRAR USUÁRIO - POST
    // =====================================================
    async cadastrarUsuarios(request, response) {
        try {

            const {
                nome_usu,
                email_usu,
                senha_usu,
                status_usu,
                dt_cad
            } = request.body;

            const sql = `
                INSERT INTO usuarios
                    (nome_usu, email_usu, senha_usu, status_usu, dt_cad)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

            const valores = [
                nome_usu,
                email_usu,
                senha_usu,
                status_usu,
                dt_cad
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso.',
                dados: {
                    id_usu: resultado.insertId,
                    nome_usu,
                    email_usu,
                    senha_usu,
                    status_usu,
                    dt_cad
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


    // =====================================================
    // EDITAR USUÁRIO - PATCH
    // =====================================================
    async editarUsuarios(request, response) {
        try {

            const { id } = request.params;

            const {
                nome_usu,
                email_usu,
                senha_usu,
                status_usu,
                dt_cad
            } = request.body;

            const sql = `
                UPDATE usuarios
                SET
                    nome_usu = ?,
                    email_usu = ?,
                    senha_usu = ?,
                    status_usu = ?,
                    dt_cad = ?
                WHERE id_usu = ?;
            `;

            const valores = [
                nome_usu,
                email_usu,
                senha_usu,
                status_usu,
                dt_cad,
                id
            ];

            const [resultado] = await db.query(sql, valores);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso.',
                dados: {
                    id_usu: id,
                    nome_usu,
                    email_usu,
                    senha_usu,
                    status_usu,
                    dt_cad
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


    // =====================================================
    // APAGAR USUÁRIO - DELETE
    // =====================================================
    async apagarUsuarios(request, response) {
        try {

            const { id } = request.params;

            const sql = `
               UPDATE usuarios
            SET status_usu = 'inativo'
            WHERE id_usu = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Usuário apagado com sucesso.',
                dados: {
                    id_usu: id
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    }

};