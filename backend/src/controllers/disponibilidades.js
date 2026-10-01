const db = require("../database/connection");

module.exports = {
<<<<<<< HEAD

    // =====================================================
    // LISTAR DISPONIBILIDADES - GET
    // =====================================================
    async listarDisponibilidades(request, response) {
        try {

            const sql = `
=======
  async listarDisponibilidades(request, response) {
    try {
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
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

<<<<<<< HEAD
            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de disponibilidades.',
                items: rows.length,
                dados: rows
            });
=======
      const [dados] = await db.query(sql);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Lista de disponibilidades.",
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

  async cadastrarDisponibilidades(request, response) {
    try {
      const { id_qd, dia_semana, hora_inicio, hora_fim, status_disp } =
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
=======
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
                INSERT INTO disponibilidades
                    (id_qd, dia_semana, hora_inicio, hora_fim, status_disp)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

      const valores = [id_qd, dia_semana, hora_inicio, hora_fim, status_disp];

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
          status_disp,
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

  async editarDisponibilidades(request, response) {
    try {
      const { id_disp, id_qd, dia_semana, hora_inicio, hora_fim, status_disp } =
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
=======
      const sql = `
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b
                UPDATE disponibilidades
                SET
                    id_qd = ?,
                    dia_semana = ?,
                    hora_inicio = ?,
                    hora_fim = ?,
                    status_disp = ?
                WHERE id_disp = ?;
            `;

<<<<<<< HEAD
            const valores = [
                id_qd,
                dia_semana,
                hora_inicio,
                hora_fim,
                status_disp,
                id
            ];
=======
      const valores = [
        id_qd,
        dia_semana,
        hora_inicio,
        hora_fim,
        status_disp,
        id_disp,
      ];
>>>>>>> 29f67fbc0d758a9bd30d73f72df9821d4e00427b

      const [resultado] = await db.query(sql, valores);

<<<<<<< HEAD
            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Disponibilidade não encontrada.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Disponibilidade atualizada com sucesso.',
                dados: {
                    id_disp: id,
                    id_qd,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    status_disp
                }
            });
=======
      return response.status(200).json({
        sucesso: true,
        mensagem: "Disponibilidade atualizada com sucesso.",
        dados: {
          linhasAfetadas: resultado.affectedRows,
          id_disp,
          id_qd,
          dia_semana,
          hora_inicio,
          hora_fim,
          status_disp,
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

  async apagarDisponibilidades(request, response) {
    try {
      const { id_disp } = request.body;

<<<<<<< HEAD
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
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
                    mensagem: 'Disponibilidade não encontrada.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Disponibilidade inativada com sucesso.',
                dados: {
                    id_disp: id
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
                DELETE FROM disponibilidades
                WHERE id_disp = ?;
            `;

      const [resultado] = await db.query(sql, [id_disp]);

      return response.status(200).json({
        sucesso: true,
        mensagem: "Disponibilidade apagada com sucesso.",
        dados: {
          linhasAfetadas: resultado.affectedRows,
          id_disp: id_disp,
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
