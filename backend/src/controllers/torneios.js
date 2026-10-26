const db = require("../database/Connection");
const { validarId, validarData } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");

const STATUS_TORNEIO = ["aberto", "em breve", "em andamento", "encerrado", "inativo"];

// Valida só os campos presentes (serve para cadastro e edição).
// Retorna a mensagem de erro ou null se estiver tudo certo.
function validarCamposTorneio(dados) {
    const tamanho = (valor) => String(valor ?? "").trim().length;

    if (dados.nome_torn !== undefined && (tamanho(dados.nome_torn) === 0 || tamanho(dados.nome_torn) > 100)) {
        return "O nome deve ter entre 1 e 100 caracteres.";
    }
    if (dados.desc_torn !== undefined && (tamanho(dados.desc_torn) === 0 || tamanho(dados.desc_torn) > 300)) {
        return "A descrição deve ter entre 1 e 300 caracteres.";
    }
    if (dados.dt_torn !== undefined && !validarData(dados.dt_torn)) {
        return "Data do torneio inválida. Use o formato YYYY-MM-DD.";
    }
    if (dados.status_torn !== undefined && !STATUS_TORNEIO.includes(dados.status_torn)) {
        return `O status deve ser: ${STATUS_TORNEIO.join(", ")}.`;
    }
    if (dados.limite_part_torn !== undefined && dados.limite_part_torn !== null && !validarId(dados.limite_part_torn)) {
        return "O limite de participantes deve ser um número inteiro maior que zero.";
    }
    if (dados.premiacao_torn !== undefined && dados.premiacao_torn !== null && tamanho(dados.premiacao_torn) > 300) {
        return "A premiação deve ter no máximo 300 caracteres.";
    }
    if (dados.valor_part !== undefined && dados.valor_part !== null) {
        const valor = Number.parseFloat(dados.valor_part);
        if (!Number.isFinite(valor) || valor < 0) return "O valor de participação deve ser um número maior ou igual a zero.";
    }
    return null;
}

module.exports = {

    // =====================================================
    // LISTAR TORNEIOS - GET
    // =====================================================
    async listarTorneios(request, response) {
        try {

            const sql = `
                SELECT
                    id_torn,
                    nome_torn,
                    dt_torn,
                    desc_torn,
                    status_torn,
                    limite_part_torn,
                    premiacao_torn,
                    dt_cad,
                    valor_part
                FROM torneios
                ORDER BY id_torn;
            `;

            const [rows] = await db.query(sql);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Lista de torneios.",
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
    // CADASTRAR TORNEIO - POST
    // =====================================================
    async cadastrarTorneios(request, response) {
        try {

            const {
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn = "aberto",
                limite_part_torn = null,
                premiacao_torn = null,
                valor_part = null
            } = request.body || {};

            // Data de cadastro definida pelo servidor
            const dt_cad = new Date().toLocaleDateString("sv-SE");

            if (!nome_torn || !dt_torn || !desc_torn) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: nome_torn, dt_torn e desc_torn.",
                    dados: null
                });
            }

            const erro = validarCamposTorneio({ nome_torn, dt_torn, desc_torn, status_torn, limite_part_torn, premiacao_torn, valor_part });
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
                    dados: null
                });
            }

            const sql = `
                INSERT INTO torneios
                    (
                        nome_torn,
                        dt_torn,
                        desc_torn,
                        status_torn,
                        limite_part_torn,
                        premiacao_torn,
                        dt_cad,
                        valor_part
                    )
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const valores = [
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                premiacao_torn,
                dt_cad,
                valor_part
            ];

            const [resultado] = await db.query(sql, valores);

            return response.status(201).json({
                sucesso: true,
                mensagem: "Torneio cadastrado com sucesso.",
                dados: {
                    id_torn: resultado.insertId,
                    nome_torn,
                    dt_torn,
                    desc_torn,
                    status_torn,
                    limite_part_torn,
                    premiacao_torn,
                    dt_cad,
                    valor_part
                }
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
    // EDITAR TORNEIO - PATCH
    // =====================================================
    async editarTorneios(request, response) {
        try {

            const { id } = request.params;
            const dados = request.body || {};

            if (!validarId(id)) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "O id do torneio deve ser numérico.",
                    dados: null
                });
            }

            const erro = validarCamposTorneio(dados);
            if (erro) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: erro,
                    dados: null
                });
            }

            // Mapeamento dos campos válidos (dt_cad não é editável)
            const { setClauses, values } = montarUpdate(dados, {
                nome_torn: "nome_torn",
                dt_torn: "dt_torn",
                desc_torn: "desc_torn",
                status_torn: "status_torn",
                limite_part_torn: "limite_part_torn",
                premiacao_torn: "premiacao_torn",
                valor_part: "valor_part"
            });

            if (setClauses.length === 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Nenhum campo válido enviado para atualização.",
                    dados: null
                });
            }

            values.push(id);

            const sql = `
                UPDATE torneios
                SET ${setClauses.join(", ")}
                WHERE id_torn = ?;
            `;

            const [resultado] = await db.query(sql, values);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Torneio com ID ${id} não encontrado.`,
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Torneio atualizado com sucesso.",
                dados: { id_torn: Number(id) }
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
    // INATIVAR TORNEIO - DELETE
    // =====================================================
    async apagarTorneios(request, response) {
        try {

            const { id } = request.params;

            const sql = `
                UPDATE torneios
                SET status_torn = 'inativo'
                WHERE id_torn = ?;
            `;

            const [resultado] = await db.query(sql, [id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: "Torneio não encontrado.",
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Torneio inativado com sucesso.",
                dados: {
                    id_torn: id
                }
            });

        } catch (error) {

            return response.status(500).json({
                sucesso: false,
                mensagem: "Erro na requisição.",
                dados: error.message
            });

        }
    },

    // INNER JOIN da relação N:N: torneio -> equipes -> usuários.
    async listarParticipantesDoTorneio(request, response) {
        try {
            const { id } = request.params;
            const [torneios] = await db.query(`
                SELECT id_torn, nome_torn, dt_torn, status_torn, limite_part_torn
                FROM torneios
                WHERE id_torn = ?;
            `, [id]);

            if (!torneios.length) {
                return response.status(404).json({ sucesso: false, mensagem: "Torneio não encontrado.", dados: null });
            }

            const [rows] = await db.query(`
                SELECT
                    e.id_equipe AS id_equipe,
                    e.nome_equipe AS nome_equipe,
                    e.status_equipe AS status_equipe,
                    u.id_usu AS id_usuario,
                    u.nome_usu AS nome_usuario,
                    u.email_usu AS email_usuario,
                    pe.dt_part AS data_participacao,
                    pe.status_part AS status_participacao
                FROM equipes_torneio e
                INNER JOIN participantes_equipe pe ON pe.id_equipe = e.id_equipe
                INNER JOIN usuarios u ON u.id_usu = pe.id_usu
                WHERE e.id_torn = ?
                ORDER BY e.id_equipe, u.nome_usu;
            `, [id]);

            const equipes = [];
            for (const row of rows) {
                let equipe = equipes.find((item) => item.id === row.id_equipe);
                if (!equipe) {
                    equipe = {
                        id: row.id_equipe,
                        nome: row.nome_equipe,
                        status: row.status_equipe,
                        participantes: []
                    };
                    equipes.push(equipe);
                }
                equipe.participantes.push({
                    id: row.id_usuario,
                    nome: row.nome_usuario,
                    email: row.email_usuario,
                    dataParticipacao: row.data_participacao,
                    status: row.status_participacao
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: "Participantes do torneio.",
                dados: { ...torneios[0], equipes }
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar participantes do torneio.", dados: error.message });
        }
    }

};
