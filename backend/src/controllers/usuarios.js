const db = require("../database/connection");

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
                ORDER BY id_usu;
            `;

      const [rows] = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Lista de usuários.",
        items: rows.length,
        dados: rows,
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
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
        status_usu = 1,
        dt_cad = new Date().toISOString().slice(0, 10),
      } = request.body || {};

      if (!nome_usu || !email_usu || !senha_usu) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "Nome, e-mail e senha são obrigatórios.",
        });
      }

      const sql = `
                INSERT INTO usuarios
                    (nome_usu, email_usu, senha_usu, status_usu, dt_cad)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

      if (
        String(nome_usu).length > 100 ||
        String(email_usu).length > 100 ||
        String(senha_usu).length > 20
      ) {
        return response.status(400).json({
          sucesso: false,
          mensagem:
            "Nome e e-mail podem ter até 100 caracteres; a senha, até 20.",
        });
      }

      const valores = [nome_usu, email_usu, senha_usu, status_usu, dt_cad];

      const [resultado] = await db.query(sql, valores);

      return response.status(201).json({
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso.",
        dados: {
          id_usu: resultado.insertId,
          nome_usu,
          email_usu,
          senha_usu,
          status_usu,
          dt_cad,
        },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return response.status(409).json({
          sucesso: false,
          mensagem: "Este e-mail já está cadastrado.",
        });
      }

      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    }
  },

  // =====================================================
  // EDITAR USUÁRIO - PATCH
  // =====================================================
  async editarUsuarios(request, response) {
    try {
      const { id } = request.params;

      const { nome_usu, email_usu, senha_usu, status_usu, dt_cad } =
        request.body;

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

      const valores = [nome_usu, email_usu, senha_usu, status_usu, dt_cad, id];

      const [resultado] = await db.query(sql, valores);

      if (resultado.affectedRows === 0) {
        return response.status(404).json({
          sucesso: false,
          mensagem: "Usuário não encontrado.",
          dados: null,
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: "Usuário atualizado com sucesso.",
        dados: {
          id_usu: id,
          nome_usu,
          email_usu,
          senha_usu,
          status_usu,
          dt_cad,
        },
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
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
                DELETE FROM usuarios
                WHERE id_usu = ?;
            `;

      const [resultado] = await db.query(sql, [id]);

      if (resultado.affectedRows === 0) {
        return response.status(404).json({
          sucesso: false,
          mensagem: "Usuário não encontrado.",
          dados: null,
        });
      }

      return response.status(200).json({
        sucesso: true,
        mensagem: "Usuário apagado com sucesso.",
        dados: {
          id_usu: id,
        },
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    }
  },
};
