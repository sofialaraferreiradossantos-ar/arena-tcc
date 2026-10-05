const db = require("../database/connection");

module.exports = {

    async listarEstados(request, response) {
        try {

            const sql = `
                SELECT DISTINCT
                    uf
                FROM cidades
                ORDER BY uf ASC;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de estados.",
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
    }

};