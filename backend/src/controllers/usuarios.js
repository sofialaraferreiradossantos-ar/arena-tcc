const db = require('../database/connection');

module.exports = {
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
            ORDER BY id_usu;
        `;

        const [dados] = await db.query(sql);

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Lista de usuários.',
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
  async editarUsuarios(request, response) {
    try {

        const {
            id_usu,
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
            id_usu
        ];

        const [resultado] = await db.query(sql, valores);

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuário atualizado com sucesso.',
            dados: {
                linhasAfetadas: resultado.affectedRows,
                id_usu,
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
   async apagarUsuarios(request, response) {
    try {

        const { id_usu } = request.body;

        const sql = `
            DELETE FROM usuarios
            WHERE id_usu = ?;
        `;

        const [resultado] = await db.query(sql, [id_usu]);

        return response.status(200).json({
            sucesso: true,
            mensagem: 'Usuário apagado com sucesso.',
            dados: {
                linhasAfetadas: resultado.affectedRows,
                id_usu: id_usu
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
}

