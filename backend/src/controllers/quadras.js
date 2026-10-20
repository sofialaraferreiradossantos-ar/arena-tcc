const fse = require("fs-extra");
const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");
const { gerarUrl } = require("../utils/gerarUrl");

// Imagem mostrada quando a quadra não tem foto (backend/public/quadras)
const IMAGEM_PADRAO = "sem-imagem.jpg";

// No multipart (upload) todo campo chega como texto: "0" precisa virar 0.
function paraBooleano(valor) {
    return [true, 1, "1", "true", "sim"].includes(valor) ? 1 : 0;
}

// Responde com erro e apaga a imagem que o multer já salvou nesta requisição,
// para não acumular arquivos de cadastros recusados.
async function responderErro(request, response, status, mensagem, dados = null) {
    if (request.file) {
        await fse.remove(request.file.path);
    }
    return response.status(status).json({ sucesso: false, mensagem, dados });
}

// Valida só os campos presentes (serve para cadastro e edição).
// Retorna a mensagem de erro ou null se estiver tudo certo.
function validarCamposQuadra(dados) {
    if (dados.id_cidade !== undefined && !validarId(dados.id_cidade)) return "O id da cidade deve ser numérico.";
    if (dados.nome_qd !== undefined && (!texto(dados.nome_qd) || texto(dados.nome_qd).length > 100)) return "O nome deve ter entre 1 e 100 caracteres.";
    if (dados.tipo_qd !== undefined && (!texto(dados.tipo_qd) || texto(dados.tipo_qd).length > 50)) return "O tipo deve ter entre 1 e 50 caracteres.";
    if (dados.desc_qd !== undefined && (!texto(dados.desc_qd) || texto(dados.desc_qd).length > 300)) return "A descrição deve ter entre 1 e 300 caracteres.";
    if (dados.status_qd !== undefined && !["disponivel", "indisponivel"].includes(dados.status_qd)) return "O status deve ser 'disponivel' ou 'indisponivel'.";
    if (dados.valor_qd !== undefined) {
        const valor = Number.parseFloat(dados.valor_qd);
        if (!Number.isFinite(valor) || valor < 0) return "O valor deve ser um número maior ou igual a zero.";
    }
    return null;
}

async function cidadeExiste(id_cidade) {
    const [rows] = await db.query("SELECT id_cidade FROM cidades WHERE id_cidade = ?;", [id_cidade]);
    return rows.length > 0;
}

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
        imagem: gerarUrl(quadra.imagem, "quadras", IMAGEM_PADRAO),
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

            // ALTERNATIVA SEM MEXER COM TODOS OS CAMPOS: só a imagem vira URL
            const dados = rows.map(quadra => ({
                ...quadra,
                imagem: gerarUrl(quadra.imagem, "quadras", IMAGEM_PADRAO)
            }));

            return response.status(200).json({ sucesso: true, mensagem: "Quadras em destaque.", nItens: dados.length, dados });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar quadras em destaque.", dados: error.message });
        }
    },

    // Validações básicas: campos obrigatórios, formatos e cidade existente.
    // Aceita JSON ou multipart (com a foto no campo "imagem_qd").
    async cadastrarQuadras(request, response) {
        try {
            const { id_cidade, nome_qd, tipo_qd, desc_qd, status_qd = "disponivel", valor_qd, destaque_qd = 0 } = request.body || {};

            // Arquivo enviado pelo multer (upload); sem upload, mantém o nome vindo no body
            const imagem = request.file;
            const imagem_qd = imagem ? imagem.filename : (request.body?.imagem_qd || null);

            if (!id_cidade || !nome_qd || !tipo_qd || !desc_qd || valor_qd === undefined) {
                return responderErro(request, response, 400, "Cidade, nome, tipo, descrição e valor são obrigatórios.");
            }

            const erro = validarCamposQuadra({ id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd });
            if (erro) {
                return responderErro(request, response, 400, erro);
            }

            // Verificar se a cidade existe
            if (!(await cidadeExiste(id_cidade))) {
                return responderErro(request, response, 404, "Cidade não encontrada.");
            }

            const valor = Number.parseFloat(valor_qd);
            const destaque = paraBooleano(destaque_qd);
            const sql = `
                INSERT INTO quadras
                    (id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd, destaque_qd)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
            const [resultado] = await db.query(sql, [id_cidade, nome_qd, tipo_qd, desc_qd, status_qd, valor, imagem_qd, destaque]);
            return response.status(201).json({
                sucesso: true,
                mensagem: "Quadra cadastrada com sucesso.",
                dados: {
                    id_qd: resultado.insertId,
                    id_cidade: Number(id_cidade),
                    nome_qd,
                    tipo_qd,
                    desc_qd,
                    status_qd,
                    valor_qd: valor.toFixed(2),
                    imagem_qd,
                    imagem_url: gerarUrl(imagem_qd, "quadras", IMAGEM_PADRAO),
                    destaque_qd: destaque
                }
            });
        } catch (error) {
            return responderErro(request, response, 500, "Erro na requisição.", error.message);
        }
    },

    // Update dinâmico: só altera os campos enviados no body.
    // Uma nova foto pode ser enviada no campo "imagem_qd" (multipart).
    async editarQuadras(request, response) {
        try {
            const { id } = request.params;
            const dados = { ...request.body };
            if (request.file) dados.imagem_qd = request.file.filename;

            if (!inteiro(id, null)) {
                return responderErro(request, response, 400, "O id da quadra deve ser numérico.");
            }

            const erro = validarCamposQuadra(dados);
            if (erro) {
                return responderErro(request, response, 400, erro);
            }

            if (dados.id_cidade !== undefined && !(await cidadeExiste(dados.id_cidade))) {
                return responderErro(request, response, 404, "Cidade não encontrada.");
            }
            if (dados.valor_qd !== undefined) dados.valor_qd = Number.parseFloat(dados.valor_qd);
            if (dados.destaque_qd !== undefined) dados.destaque_qd = paraBooleano(dados.destaque_qd);

            const { setClauses, values } = montarUpdate(dados, {
                id_cidade: "id_cidade",
                nome_qd: "nome_qd",
                tipo_qd: "tipo_qd",
                desc_qd: "desc_qd",
                status_qd: "status_qd",
                valor_qd: "valor_qd",
                imagem_qd: "imagem_qd",
                destaque_qd: "destaque_qd"
            });
            if (setClauses.length === 0) {
                return responderErro(request, response, 400, "Nenhum campo válido enviado para atualização.");
            }

            values.push(id);
            const [resultado] = await db.query(`UPDATE quadras SET ${setClauses.join(", ")} WHERE id_qd = ?;`, values);
            if (resultado.affectedRows === 0) {
                return responderErro(request, response, 404, `Quadra com ID ${id} não encontrada.`);
            }

            const atualizado = { id_qd: Number(id) };
            if (dados.imagem_qd !== undefined) {
                atualizado.imagem_url = gerarUrl(dados.imagem_qd, "quadras", IMAGEM_PADRAO);
            }
            return response.status(200).json({ sucesso: true, mensagem: "Quadra atualizada com sucesso.", dados: atualizado });
        } catch (error) {
            return responderErro(request, response, 500, "Erro na requisição.", error.message);
        }
    },

    async apagarQuadras(request, response) {
        try {
            const { id } = request.params;
            if (!inteiro(id, null)) {
                return response.status(400).json({ sucesso: false, mensagem: "O id da quadra deve ser numérico.", dados: null });
            }
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
