const db = require("../database/Connection");
const bcrypt = require("bcrypt");
const { validarEmail, validarId } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const SALT_ROUNDS = 10;

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
                    status_usu,
                    dt_cad
                FROM usuarios
                WHERE status_usu = 'ativo'
                ORDER BY id_usu;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de usuários.",
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
    // CADASTRAR USUÁRIO - POST
    // =====================================================
    async cadastrarUsuarios(request, response) {
        try {

            const nome_usu = String(request.body?.nome_usu ?? "").trim();
            const email_usu = String(request.body?.email_usu ?? "").trim().toLowerCase();
            const senha_usu = String(request.body?.senha_usu ?? "");

            // Verifica campos obrigatórios
            if (!nome_usu || !email_usu || !senha_usu) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nome, e-mail e senha são obrigatórios.",
                    dados: null
                });
            }

            if (nome_usu.length > 100) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O nome deve ter no máximo 100 caracteres.",
                    dados: null
                });
            }

            // Validação de e-mail (utils/validacoes)
            if (!validarEmail(email_usu) || email_usu.length > 100) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "E-mail inválido.",
                    dados: null
                });
            }

            if (senha_usu.length < 6 || senha_usu.length > 20) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "A senha deve ter entre 6 e 20 caracteres.",
                    dados: null
                });
            }

            // Verifica se o e-mail já existe
            const [emailExiste] = await db.query(
                "SELECT id_usu FROM usuarios WHERE LOWER(email_usu) = ?;",
                [email_usu]
            );

            if (emailExiste.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "E-mail já cadastrado.",
                    dados: null
                });
            }

            // Criptografa a senha antes de gravar (bcrypt)
            const hashedPassword = await bcrypt.hash(senha_usu, SALT_ROUNDS);

            // Status e data de cadastro são definidos pelo servidor
            const status_usu = "ativo";
            const dt_cad = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD

            const sql = `
                INSERT INTO usuarios
                    (nome_usu, email_usu, senha_usu, status_usu, dt_cad)
                VALUES
                    (?, ?, ?, ?, ?);
            `;

            const valores = [nome_usu, email_usu, hashedPassword, status_usu, dt_cad];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Usuário cadastrado com sucesso.",
                dados: {
                    id_usu: resultado.insertId,
                    nome_usu,
                    email_usu,
                    status_usu,
                    dt_cad
                }
            });

        } catch (error) {

            if (error.code === "ER_DUP_ENTRY") {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "E-mail já cadastrado."
                });
            }

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // EDITAR USUÁRIO - PATCH (UPDATE DINÂMICO)
    // =====================================================
    async editarUsuarios(request, response) {
        try {

            const { id } = request.params;
            const dados = { ...request.body };

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do usuário deve ser numérico.",
                    dados: null
                });
            }

            // A senha tem rota própria, pois precisa ser criptografada
            if (dados.senha_usu !== undefined) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Para trocar a senha use PATCH /usuarios/atualiza-senha/:id.",
                    dados: null
                });
            }

            if (dados.nome_usu !== undefined) {
                dados.nome_usu = String(dados.nome_usu).trim();
                if (!dados.nome_usu || dados.nome_usu.length > 100) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: "O nome deve ter entre 1 e 100 caracteres.",
                        dados: null
                    });
                }
            }

            if (dados.email_usu !== undefined) {
                dados.email_usu = String(dados.email_usu).trim().toLowerCase();
                if (!validarEmail(dados.email_usu) || dados.email_usu.length > 100) {
                    return response.status(400).json({
                        sucesso: false,
                        mensagem: "E-mail inválido.",
                        dados: null
                    });
                }

                // O e-mail não pode pertencer a outro usuário
                const [emailExiste] = await db.query(
                    "SELECT id_usu FROM usuarios WHERE LOWER(email_usu) = ? AND id_usu <> ?;",
                    [dados.email_usu, id]
                );
                if (emailExiste.length > 0) {
                    return response.status(409).json({
                        sucesso: false,
                        mensagem: "E-mail já cadastrado.",
                        dados: null
                    });
                }
            }

            if (dados.status_usu !== undefined && !["ativo", "inativo"].includes(dados.status_usu)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O status deve ser 'ativo' ou 'inativo'.",
                    dados: null
                });
            }

            // Mapeamento dos campos válidos para o banco de dados
            const camposValidos = {
                nome_usu: "nome_usu",
                email_usu: "email_usu",
                status_usu: "status_usu"
            };

            const { setClauses, values } = montarUpdate(dados, camposValidos);

            // Se nenhum campo válido foi enviado, retorna erro
            if (setClauses.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum campo válido enviado para atualização.",
                    dados: null
                });
            }

            values.push(id);

            const sql = `
                UPDATE usuarios
                SET ${setClauses.join(", ")}
                WHERE id_usu = ?;
            `;

            const [resultado] = await db.query(sql, values);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Usuário atualizado com sucesso.",
                dados: { id_usu: Number(id) }
            });

        } catch (error) {

            if (error.code === "ER_DUP_ENTRY") {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: "E-mail já cadastrado."
                });
            }

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },


    // =====================================================
    // ATUALIZAR SENHA - PATCH
    // Exige a senha atual para definir uma nova.
    // =====================================================
    async atualizarSenha(request, response) {
        try {

            const { id } = request.params;
            const { senhaAtual, novaSenha } = request.body || {};

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do usuário deve ser numérico.",
                    dados: null
                });
            }

            if (!senhaAtual || !novaSenha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Informe a senha atual e a nova senha.",
                    dados: null
                });
            }

            if (String(novaSenha).length < 6 || String(novaSenha).length > 20) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "A nova senha deve ter entre 6 e 20 caracteres.",
                    dados: null
                });
            }

            const [rows] = await db.query(
                "SELECT senha_usu FROM usuarios WHERE id_usu = ?;",
                [id]
            );

            if (rows.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Usuário ${id} não encontrado!`,
                    dados: null
                });
            }

            const senhaCorreta = await bcrypt.compare(String(senhaAtual), rows[0].senha_usu);

            if (!senhaCorreta) {
                return response.status(401).json({
                    sucesso: false,
                    mensagem: "Senha atual incorreta.",
                    dados: null
                });
            }

            const hashedPassword = await bcrypt.hash(String(novaSenha), SALT_ROUNDS);

            await db.query(
                "UPDATE usuarios SET senha_usu = ? WHERE id_usu = ?;",
                [hashedPassword, id]
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: `Senha do usuário ${id} atualizada com sucesso!`,
                dados: null
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
    // APAGAR USUÁRIO - DELETE (EXCLUSÃO LÓGICA)
    // =====================================================
    async apagarUsuarios(request, response) {
        try {

            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do usuário deve ser numérico.",
                    dados: null
                });
            }

            const sql = `
                UPDATE usuarios
                SET status_usu = 'inativo'
                WHERE id_usu = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Usuário não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Usuário inativado com sucesso.",
                dados: {
                    id_usu: id
                }
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
