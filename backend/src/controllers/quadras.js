const db = require("../database/Connection");

function inteiro(valor, padrao) {
    const numero = Number.parseInt(valor, 10);
    return Number.isInteger(numero) && numero > 0 ? numero : padrao;
}

function texto(valor) {
    return String(valor ?? "").trim();
}

function quadraTratada(quadra) {
    return {
        id: quadra.id,
        nome: quadra.nome,
        tipo: quadra.tipo,
        descricao: quadra.descricao,
        valor: quadra.valor,
        disponivel: quadra.status === "disponivel",
        imagem: quadra.imagem,
        destaque: Boolean(quadra.destaque),
        cidade: quadra.cidade,
        uf: quadra.uf
    };
}

module.exports = {
    // Consulta parametrizada + INNER JOIN + paginação + total de itens.
    async listarQuadras(request, response) {
        try {
            const { id, nome, tipo, valor, disponivel = "1", uf, cidade } = request.query;
            const page = inteiro(request.query.page, 1);
            const limit = Math.min(inteiro(request.query.limit, 5), 100);
            const offset = (page - 1) * limit;
            const filtros = [];
            const valores = [];
            const disponibilidade = texto(disponivel).toLowerCase();

            if (!["", "todos", "all"].includes(disponibilidade)) {
                filtros.push("q.status_qd = ?");
                valores.push(["0", "false", "indisponivel", "inativo"].includes(disponibilidade)
                    ? "indisponivel"
                    : "disponivel");
            }

            if (id !== undefined && id !== "") {
                const idNumero = inteiro(id, null);
                if (!idNumero) {
                    return response.status(400).json({ sucesso: false, mensagem: "O id da quadra deve ser numérico." });
                }
                filtros.push("q.id_qd = ?");
                valores.push(idNumero);
            }

            if (texto(nome)) {
                filtros.push("q.nome_qd LIKE ?");
                valores.push(`%${texto(nome)}%`);
            }

            if (texto(tipo)) {
                filtros.push("q.tipo_qd LIKE ?");
                valores.push(`%${texto(tipo)}%`);
            }

            if (valor !== undefined && valor !== "") {
                const valorNumero = Number.parseFloat(valor);
                if (!Number.isFinite(valorNumero) || valorNumero < 0) {
                    return response.status(400).json({ sucesso: false, mensagem: "O valor máximo deve ser numérico." });
                }
                filtros.push("q.valor_qd <= ?");
                valores.push(valorNumero);
            }

            if (texto(uf)) {
                filtros.push("c.uf = ?");
                valores.push(texto(uf).toUpperCase());
            }

            if (texto(cidade)) {
                filtros.push("c.nome_cidade LIKE ?");
                valores.push(`%${texto(cidade)}%`);
            }

            const where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";
            const from = `
                FROM quadras q
                INNER JOIN cidades c ON c.id_cidade = q.id_cidade
                ${where}
            `;

            const [countRows] = await db.query(`SELECT COUNT(*) AS total ${from};`, valores);
            const total = Number(countRows[0]?.total || 0);
            const listSql = `
                SELECT
                    q.id_qd AS id,
                    q.nome_qd AS nome,
                    q.tipo_qd AS tipo,
                    q.desc_qd AS descricao,
                    q.valor_qd AS valor,
                    q.status_qd AS status,
                    q.imagem_qd AS imagem,
                    q.destaque_qd AS destaque,
                    c.nome_cidade AS cidade,
                    c.uf
                ${from}
                ORDER BY q.id_qd
                LIMIT ? OFFSET ?;
            `;

            const [rows] = await db.query(listSql, [...valores, limit, offset]);
            const dados = rows.map(quadraTratada);
            response.setHeader("X-Total-Count", String(total));

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de quadras.",
                items: dados.length,
                nItens: dados.length,
                total,
                pagina: page,
                limite: limit,
                dados
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar quadras.", dados: error.message });
        }
    },

    // Equivalente à rota de promoções do material: ordem aleatória e no máximo 3.
    async listarDestaques(request, response) {
        try {
            const sql = `
                SELECT
                    q.id_qd AS id,
                    q.nome_qd AS nome,
                    q.valor_qd AS valor,
                    q.imagem_qd AS imagem,
                    c.nome_cidade AS cidade,
                    c.uf
                FROM quadras q
                INNER JOIN cidades c ON c.id_cidade = q.id_cidade
                WHERE q.status_qd = 'disponivel' AND q.destaque_qd = 1
                ORDER BY RAND()
                LIMIT 3;
            `;
            const [rows] = await db.query(sql);
            return response.status(200).json({ sucesso: true, mensagem: "Quadras em destaque.", nItens: rows.length, dados: rows });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar quadras em destaque.", dados: error.message });
        }
    },

    async cadastrarQuadras(request, response) {
        try {
            const { id_cidade, nome_qd, tipo_qd, desc_qd, status_qd = "disponivel", valor_qd, imagem_qd = null, destaque_qd = 0 } = request.body || {};
            if (!id_cidade || !nome_qd || !tipo_qd || !desc_qd || valor_qd === undefined) {
                return response.status(400).json({ sucesso: false, mensagem: "Cidade, nome, tipo, descrição e valor são obrigatórios." });
            }

            const sql = `
                INSERT INTO quadras
                    (id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd, destaque_qd)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const [resultado] = await db.query(sql, [id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd, destaque_qd ? 1 : 0]);
            return response.status(201).json({ sucesso: true, mensagem: "Quadra cadastrada com sucesso.", dados: { id_qd: resultado.insertId, ...request.body } });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },

    async editarQuadras(request, response) {
        try {
            const { id } = request.params;
            const { id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd = null, destaque_qd = 0 } = request.body || {};
            const sql = `
                UPDATE quadras
                SET id_cidade = ?, nome_qd = ?, tipo_qd = ?, desc_qd = ?, status_qd = ?, valor_qd = ?, imagem_qd = ?, destaque_qd = ?
                WHERE id_qd = ?;
            `;
            const [resultado] = await db.query(sql, [id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd, destaque_qd ? 1 : 0, id]);
            if (resultado.affectedRows === 0) {
                return response.status(404).json({ sucesso: false, mensagem: "Quadra não encontrada.", dados: null });
            }
            return response.status(200).json({ sucesso: true, mensagem: "Quadra atualizada com sucesso.", dados: { id_qd: id, ...request.body } });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },

    async apagarQuadras(request, response) {
        try {
            const { id } = request.params;
            const [resultado] = await db.query("UPDATE quadras SET status_qd = 'indisponivel' WHERE id_qd = ?;", [id]);
            if (resultado.affectedRows === 0) {
                return response.status(404).json({ sucesso: false, mensagem: "Quadra não encontrada.", dados: null });
            }
            return response.status(200).json({ sucesso: true, mensagem: "Quadra inativada com sucesso.", dados: { id_qd: id } });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    }
};
