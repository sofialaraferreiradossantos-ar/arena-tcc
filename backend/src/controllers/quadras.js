const db = require("../database/connection");

module.exports = {
<<<<<<< HEAD

    // =====================================================
    // LISTAR QUADRAS - GET
    // =====================================================
    async listarQuadras(request, response) {
        try {

            const sql = `
=======
  async listarQuadras(request, response) {
    try {
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
                SELECT
                    id_qd,
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd
                FROM quadras
                WHERE status_qd = 'disponivel'
                ORDER BY id_qd;
            `;

<<<<<<< HEAD
            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de quadras.',
                items: rows.length,
                dados: rows
            });
=======
      const [dados] = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Lista de quadras.",
        dados: dados,
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Erro na requisição.",
        dados: error.message,
      });
    }
  },
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

  async cadastrarQuadras(request, response) {
    try {
      const { nome_qd, tipo_qd, desc_qd, status_qd, valor_qd } = request.body;

<<<<<<< HEAD
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // =====================================================
    // CADASTRAR QUADRA - POST
    // =====================================================
    async cadastrarQuadras(request, response) {
        try {

            const {
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd
            } = request.body;

            const sql = `
=======
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
                INSERT INTO quadras
                    (nome_qd, tipo_qd, desc_qd, status_qd, valor_qd)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

      const valores = [nome_qd, tipo_qd, desc_qd, status_qd, valor_qd];

      const [resultado] = await db.query(sql, valores);

      return response.status(201).json({
        sucesso: true,
        mensagem: "Quadra cadastrada com sucesso.",
        dados: {
          id_qd: resultado.insertId,
          nome_qd,
          tipo_qd,
          desc_qd,
          status_qd,
          valor_qd,
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

  async editarQuadras(request, response) {
    try {
      const { id_qd, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd } =
        request.body;

<<<<<<< HEAD
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR QUADRA - PATCH
    // =====================================================
    async editarQuadras(request, response) {
        try {

            const { id } = request.params;

            const {
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd
            } = request.body;

            const sql = `
=======
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
                UPDATE quadras
                SET
                    nome_qd = ?,
                    tipo_qd = ?,
                    desc_qd = ?,
                    status_qd = ?,
                    valor_qd = ?
                WHERE id_qd = ?;
            `;

<<<<<<< HEAD
            const valores = [
                nome_qd,
                tipo_qd,
                desc_qd,
                status_qd,
                valor_qd,
                id
            ];
=======
      const valores = [nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, id_qd];
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

      const [resultado] = await db.query(sql, valores);

<<<<<<< HEAD
            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Quadra não encontrada.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quadra atualizada com sucesso.',
                dados: {
                    id_qd: id,
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd
                }
            });
=======
      return response.status(200).json({
        sucesso: true,
        mensagem: "Quadra atualizada com sucesso.",
        dados: {
          linhasAfetadas: resultado.affectedRows,
          id_qd,
          nome_qd,
          tipo_qd,
          desc_qd,
          status_qd,
          valor_qd,
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
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

  async apagarQuadras(request, response) {
    try {
      const { id_qd } = request.body;

<<<<<<< HEAD
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });

        }
    },


    // =====================================================
    // INATIVAR QUADRA - DELETE
    // =====================================================
    async apagarQuadras(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE quadras
                SET status_qd = 'indisponivel'
                WHERE id_qd = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Quadra não encontrada.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Quadra inativada com sucesso.',
                dados: {
                    id_qd: id
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
=======
      const sql = `
                DELETE FROM quadras
                WHERE id_qd = ?;
            `;

      const [resultado] = await db.query(sql, [id_qd]);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Quadra apagada com sucesso.",
        dados: {
          linhasAfetadas: resultado.affectedRows,
          id_qd: id_qd,
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
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
