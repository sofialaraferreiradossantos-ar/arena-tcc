const db = require("../database/Connection");

module.exports = {

    async listarCidades(request, response) {
        try {
            const uf = String(request.query.uf || "").trim().toUpperCase();
            const cidade = String(request.query.cidade || "").trim();

            if (!uf) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "UF (estado) é obrigatória para listar cidades.",
                    dados: null
                });
            }

            const sql = `
                SELECT
                    id_cidade AS id,
                    nome_cidade AS cidade,
                    uf
                FROM cidades
                WHERE uf = ?
                  AND nome_cidade LIKE ?
                ORDER BY nome_cidade ASC;
            `;

            const [rows] = await db.query(sql, [uf, `%${cidade}%`]);

            return response.status(200).json({
                sucesso: true,
                mensagem: rows.length
                    ? "Lista de cidades encontrada com sucesso."
                    : "Nenhuma cidade encontrada com os critérios fornecidos.",
                nItens: rows.length,
                dados: rows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro interno ao listar cidades.",
                dados: error.message
            });
        }
    },

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
