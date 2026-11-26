const db = require("../database/Connection");
const { validarId, validarData } = require("../utils/validacoes");
const montarUpdate = require("../utils/montarUpdate");
const { notificarAdmins } = require("../utils/notificacoes");

const STATUS_TORNEIO = ["aberto", "em breve", "em andamento", "encerrado", "inativo"];
const MODALIDADES = ["Futevôlei", "Beach Tennis"];
const CATEGORIAS_TORNEIO = ["Feminino", "Masculino", "Misto"];
// Dados do participante pedidos na inscrição pelo site
const NIVEIS = ["Iniciante", "Intermediário", "Avançado"];
const CATEGORIAS_PARTICIPANTE = ["A", "B", "C", "D"];
// Integrantes por equipe: o administrador define em cada torneio
// (campo integrantes_torn); 2 = duplas, se não for informado
const INTEGRANTES_PADRAO = 2;
const INTEGRANTES_MAXIMO = 20;

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
    if (dados.integrantes_torn !== undefined) {
        const n = Number(dados.integrantes_torn);
        if (!Number.isInteger(n) || n < 1 || n > INTEGRANTES_MAXIMO) {
            return `O número de integrantes por equipe deve ser um número inteiro de 1 a ${INTEGRANTES_MAXIMO}.`;
        }
    }
    if (dados.premiacao_torn !== undefined && dados.premiacao_torn !== null && tamanho(dados.premiacao_torn) > 300) {
        return "A premiação deve ter no máximo 300 caracteres.";
    }
    if (dados.valor_part !== undefined && dados.valor_part !== null) {
        const valor = Number.parseFloat(dados.valor_part);
        if (!Number.isFinite(valor) || valor < 0) return "O valor de participação deve ser um número maior ou igual a zero.";
    }
    // Modalidade, categoria e local são obrigatórios (NOT NULL no banco)
    if (dados.modalidade_torn !== undefined && !MODALIDADES.includes(dados.modalidade_torn)) {
        return `A modalidade deve ser: ${MODALIDADES.join(" ou ")}.`;
    }
    if (dados.categoria_torn !== undefined && !CATEGORIAS_TORNEIO.includes(dados.categoria_torn)) {
        return `A categoria do torneio deve ser: ${CATEGORIAS_TORNEIO.join(", ")}.`;
    }
    if (dados.local_torn !== undefined && (tamanho(dados.local_torn) === 0 || tamanho(dados.local_torn) > 20)) {
        return "Informe o local (até 20 caracteres).";
    }
    return null;
}

module.exports = {

    // =====================================================
    // LISTAR TORNEIOS - GET
    // =====================================================
    async listarTorneios(request, response) {
        try {

            // "inscritos" = participantes que não cancelaram (usado para mostrar as vagas)
            const sql = `
                SELECT
                    t.id_torn,
                    t.nome_torn,
                    DATE_FORMAT(t.dt_torn, '%Y-%m-%d') AS dt_torn,
                    t.desc_torn,
                    t.status_torn,
                    t.limite_part_torn,
                    t.integrantes_torn,
                    t.premiacao_torn,
                    DATE_FORMAT(t.dt_cad, '%Y-%m-%d') AS dt_cad,
                    t.valor_part,
                    t.modalidade_torn,
                    t.categoria_torn,
                    t.local_torn,
                    (
                        SELECT COUNT(*)
                        FROM participantes_equipe pe
                        INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
                        WHERE e.id_torn = t.id_torn AND pe.status_part <> 'cancelado'
                    ) AS inscritos
                FROM torneios t
                ORDER BY t.dt_torn, t.id_torn;
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
                integrantes_torn = INTEGRANTES_PADRAO,
                premiacao_torn = null,
                valor_part = null,
                modalidade_torn = null,
                categoria_torn = null,
                local_torn = null
            } = request.body || {};

            // Data de cadastro definida pelo servidor
            const dt_cad = new Date().toLocaleDateString("sv-SE");

            if (!nome_torn || !dt_torn || !desc_torn || !modalidade_torn || !categoria_torn || !String(local_torn ?? "").trim()) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: "Campos obrigatórios: nome_torn, dt_torn, desc_torn, modalidade_torn, categoria_torn e local_torn.",
                    dados: null
                });
            }

            const erro = validarCamposTorneio({ nome_torn, dt_torn, desc_torn, status_torn, limite_part_torn, integrantes_torn, premiacao_torn, valor_part, modalidade_torn, categoria_torn, local_torn });
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
                        integrantes_torn,
                        premiacao_torn,
                        dt_cad,
                        valor_part,
                        modalidade_torn,
                        categoria_torn,
                        local_torn
                    )
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const valores = [
                nome_torn,
                dt_torn,
                desc_torn,
                status_torn,
                limite_part_torn,
                Number(integrantes_torn),
                premiacao_torn,
                dt_cad,
                valor_part,
                modalidade_torn,
                categoria_torn,
                local_torn
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
                    integrantes_torn: Number(integrantes_torn),
                    premiacao_torn,
                    dt_cad,
                    valor_part,
                    modalidade_torn,
                    categoria_torn,
                    local_torn
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
                integrantes_torn: "integrantes_torn",
                premiacao_torn: "premiacao_torn",
                valor_part: "valor_part",
                modalidade_torn: "modalidade_torn",
                categoria_torn: "categoria_torn",
                local_torn: "local_torn"
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

    // =====================================================
    // INSCRIÇÃO PELO SITE - POST /torneios/:id/inscricao (cliente logado)
    // O administrador cadastra as equipes de cada torneio e define quantos
    // integrantes cada uma tem (integrantes_torn); o
    // cliente escolhe uma equipe com vaga e se inscreve nela, informando
    // telefone, nível e categoria. A participação fica "pendente" até o
    // pagamento da inscrição pelo Stripe (torneio gratuito: já confirmada).
    // =====================================================
    async inscreverNoTorneio(request, response) {
        const { id } = request.params;
        const id_usu = request.usuario.id_usu;
        const id_equipe = request.body?.id_equipe;
        const telefone_part = String(request.body?.telefone_part ?? "").trim();
        const nivel_part = String(request.body?.nivel_part ?? "").trim();
        const categoria_part = String(request.body?.categoria_part ?? "").trim();

        const erro = (status, mensagem) => response.status(status).json({ sucesso: false, mensagem, dados: null });

        if (!validarId(id)) return erro(400, "O id do torneio deve ser numérico.");
        if (!validarId(id_equipe)) return erro(400, "Escolha a equipe em que você vai jogar.");
        // Telefone com DDD: 10 ou 11 dígitos, aceitando ( ) - e espaços
        const digitosTelefone = telefone_part.replace(/\D/g, "");
        if (telefone_part.length > 20 || digitosTelefone.length < 10 || digitosTelefone.length > 11) {
            return erro(400, "Informe um telefone com DDD, por exemplo (14) 99999-0000.");
        }
        if (!NIVEIS.includes(nivel_part)) return erro(400, `O nível deve ser: ${NIVEIS.join(", ")}.`);
        if (!CATEGORIAS_PARTICIPANTE.includes(categoria_part)) {
            return erro(400, `A categoria deve ser: ${CATEGORIAS_PARTICIPANTE.join(", ")}.`);
        }

        const conexao = await db.getConnection();
        let torneio;
        let equipe;
        let id_part;
        let status_part;
        const dt_part = new Date().toLocaleDateString("sv-SE");

        try {
            await conexao.beginTransaction();

            // FOR UPDATE: duas inscrições ao mesmo tempo não passam das vagas
            [[torneio]] = await conexao.query(
                "SELECT id_torn, nome_torn, status_torn, limite_part_torn, integrantes_torn, valor_part FROM torneios WHERE id_torn = ? FOR UPDATE;",
                [id]
            );

            if (!torneio) {
                await conexao.rollback();
                return erro(404, "Torneio não encontrado.");
            }

            if (torneio.status_torn !== "aberto") {
                await conexao.rollback();
                return erro(400, "As inscrições deste torneio não estão abertas.");
            }

            [[equipe]] = await conexao.query(
                "SELECT id_equipe, nome_equipe, status_equipe FROM equipes_torneio WHERE id_equipe = ? AND id_torn = ?;",
                [id_equipe, id]
            );

            if (!equipe || equipe.status_equipe === "inativa" || equipe.status_equipe === "eliminada") {
                await conexao.rollback();
                return erro(404, "Equipe não encontrada neste torneio.");
            }

            // Libera as vagas de inscrições abandonadas: pendentes de outro dia
            // em que o pagamento nem chegou a ser iniciado no Stripe
            await conexao.query(
                `
                    UPDATE participantes_equipe pe
                    INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
                    SET pe.status_part = 'cancelado'
                    WHERE e.id_torn = ? AND pe.status_part = 'pendente' AND pe.dt_part < ?
                      AND NOT EXISTS (
                          SELECT 1 FROM pagamentos p
                          WHERE p.id_part = pe.id_part AND p.status_pag IN ('pendente', 'pago')
                      );
                `,
                [id, dt_part]
            );

            const [[jaInscrito]] = await conexao.query(
                `
                    SELECT pe.id_part, pe.status_part, pe.dt_part, pe.telefone_part, pe.nivel_part,
                           pe.categoria_part, e.id_equipe, e.nome_equipe
                    FROM participantes_equipe pe
                    INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
                    WHERE e.id_torn = ? AND pe.id_usu = ? AND pe.status_part <> 'cancelado'
                    LIMIT 1;
                `,
                [id, id_usu]
            );

            // Inscrição já feita e ainda não paga: volta para o pagamento dela
            if (jaInscrito && jaInscrito.status_part === "pendente") {
                await conexao.commit();
                return response.status(200).json({
                    sucesso: true,
                    mensagem: `Você já tem uma inscrição na equipe ${jaInscrito.nome_equipe} aguardando pagamento.`,
                    dados: {
                        id_torn: Number(id),
                        nome_torn: torneio.nome_torn,
                        valor_part: torneio.valor_part,
                        id_equipe: jaInscrito.id_equipe,
                        nome_equipe: jaInscrito.nome_equipe,
                        id_part: jaInscrito.id_part,
                        dt_part: jaInscrito.dt_part,
                        status_part: "pendente",
                        telefone_part: jaInscrito.telefone_part,
                        nivel_part: jaInscrito.nivel_part,
                        categoria_part: jaInscrito.categoria_part
                    }
                });
            }

            if (jaInscrito) {
                await conexao.rollback();
                return erro(409, "Você já está inscrito neste torneio.");
            }

            const [[{ naEquipe }]] = await conexao.query(
                "SELECT COUNT(*) AS naEquipe FROM participantes_equipe WHERE id_equipe = ? AND status_part <> 'cancelado';",
                [id_equipe]
            );

            if (Number(naEquipe) >= Number(torneio.integrantes_torn)) {
                await conexao.rollback();
                return erro(409, "Esta equipe já está completa. Escolha outra equipe.");
            }

            if (torneio.limite_part_torn) {
                const [[{ inscritos }]] = await conexao.query(
                    `
                        SELECT COUNT(*) AS inscritos
                        FROM participantes_equipe pe
                        INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
                        WHERE e.id_torn = ? AND pe.status_part <> 'cancelado';
                    `,
                    [id]
                );

                if (Number(inscritos) >= Number(torneio.limite_part_torn)) {
                    await conexao.rollback();
                    return erro(409, "Não há mais vagas neste torneio.");
                }
            }

            // Torneio pago: "pendente" até o Stripe confirmar o pagamento.
            // Torneio gratuito (sem valor): a participação já fica confirmada.
            const gratuito = !(Number(torneio.valor_part) > 0);
            status_part = gratuito ? "confirmado" : "pendente";

            const [participante] = await conexao.query(
                `INSERT INTO participantes_equipe
                    (id_equipe, id_usu, dt_part, status_part, telefone_part, nivel_part, categoria_part)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [id_equipe, id_usu, dt_part, status_part, telefone_part, nivel_part, categoria_part]
            );
            id_part = participante.insertId;

            await conexao.commit();
        } catch (error) {
            await conexao.rollback().catch(() => {});
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao fazer a inscrição.", dados: error.message });
        } finally {
            conexao.release();
        }

        // Aviso para os administradores (um erro aqui não desfaz a inscrição)
        await notificarAdmins({
            tipo: "inscricao_torneio",
            titulo: "Nova inscrição em torneio",
            mensagem: `${request.usuario.nome_usu} se inscreveu no ${torneio.nome_torn} (equipe ${equipe.nome_equipe}).`,
            link: "/administrador/torneios"
        });

        return response.status(201).json({
            sucesso: true,
            mensagem: status_part === "pendente"
                ? "Inscrição registrada. Falta pagar a inscrição para confirmar a vaga."
                : "Inscrição confirmada.",
            dados: {
                id_torn: Number(id),
                nome_torn: torneio.nome_torn,
                valor_part: torneio.valor_part,
                id_equipe: Number(id_equipe),
                nome_equipe: equipe.nome_equipe,
                id_part,
                dt_part,
                status_part,
                telefone_part,
                nivel_part,
                categoria_part
            }
        });
    },

    // =====================================================
    // EQUIPES DO TORNEIO (público) - GET /torneios/:id/equipes
    // Usado na tela de detalhes e na inscrição: só o nome da equipe e
    // quantas vagas ela ainda tem (sem dados pessoais dos participantes).
    // =====================================================
    async listarEquipesDoTorneio(request, response) {
        try {
            const { id } = request.params;
            if (!validarId(id)) {
                return response.status(400).json({ sucesso: false, mensagem: "O id do torneio deve ser numérico.", dados: null });
            }

            const [[torneio]] = await db.query("SELECT integrantes_torn FROM torneios WHERE id_torn = ?;", [id]);
            if (!torneio) {
                return response.status(404).json({ sucesso: false, mensagem: "Torneio não encontrado.", dados: null });
            }
            const porEquipe = Number(torneio.integrantes_torn);

            const [rows] = await db.query(`
                SELECT
                    e.id_equipe,
                    e.nome_equipe,
                    e.desc_equipe,
                    e.status_equipe,
                    (
                        SELECT COUNT(*) FROM participantes_equipe pe
                        WHERE pe.id_equipe = e.id_equipe AND pe.status_part <> 'cancelado'
                    ) AS integrantes
                FROM equipes_torneio e
                WHERE e.id_torn = ? AND e.status_equipe NOT IN ('inativa', 'eliminada')
                ORDER BY e.nome_equipe;
            `, [id]);

            const dados = rows.map((row) => ({
                ...row,
                integrantes: Number(row.integrantes),
                limite: porEquipe,
                vagas: Math.max(0, porEquipe - Number(row.integrantes))
            }));

            return response.status(200).json({ sucesso: true, mensagem: "Equipes do torneio.", items: dados.length, dados });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao listar as equipes.", dados: error.message });
        }
    },

    // =====================================================
    // CADASTRAR EQUIPE (admin) - POST /torneios/:id/equipes
    // Body: { nome_equipe, desc_equipe }
    // =====================================================
    async cadastrarEquipeDoTorneio(request, response) {
        const { id } = request.params;
        const nome_equipe = String(request.body?.nome_equipe ?? "").trim();
        const desc_equipe = String(request.body?.desc_equipe ?? "").trim() || "Equipe do torneio.";
        const erro = (status, mensagem) => response.status(status).json({ sucesso: false, mensagem, dados: null });

        if (!validarId(id)) return erro(400, "O id do torneio deve ser numérico.");
        if (!nome_equipe || nome_equipe.length > 100) return erro(400, "Informe o nome da equipe (até 100 caracteres).");
        if (desc_equipe.length > 300) return erro(400, "A descrição deve ter no máximo 300 caracteres.");

        try {
            const [[torneio]] = await db.query("SELECT id_torn FROM torneios WHERE id_torn = ?;", [id]);
            if (!torneio) return erro(404, "Torneio não encontrado.");

            const [[repetida]] = await db.query(
                "SELECT id_equipe FROM equipes_torneio WHERE id_torn = ? AND LOWER(nome_equipe) = LOWER(?) LIMIT 1;",
                [id, nome_equipe]
            );
            if (repetida) return erro(409, "Já existe uma equipe com esse nome neste torneio.");

            const [resultado] = await db.query(
                "INSERT INTO equipes_torneio (id_torn, nome_equipe, desc_equipe, status_equipe) VALUES (?, ?, ?, 'inscrita');",
                [id, nome_equipe, desc_equipe]
            );

            return response.status(201).json({
                sucesso: true,
                mensagem: "Equipe cadastrada com sucesso.",
                dados: { id_equipe: resultado.insertId, id_torn: Number(id), nome_equipe, desc_equipe, status_equipe: "inscrita" }
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar a equipe.", dados: error.message });
        }
    },

    // Admin: todas as equipes do torneio, com os participantes (LEFT JOIN:
    // equipes ainda sem ninguém também aparecem).
    async listarParticipantesDoTorneio(request, response) {
        try {
            const { id } = request.params;
            const [torneios] = await db.query(`
                SELECT id_torn, nome_torn, dt_torn, status_torn, limite_part_torn, integrantes_torn,
                       modalidade_torn, categoria_torn, local_torn
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
                    e.desc_equipe AS desc_equipe,
                    e.status_equipe AS status_equipe,
                    pe.id_part AS id_part,
                    u.id_usu AS id_usuario,
                    u.nome_usu AS nome_usuario,
                    u.email_usu AS email_usuario,
                    pe.dt_part AS data_participacao,
                    pe.status_part AS status_participacao,
                    pe.telefone_part AS telefone,
                    pe.nivel_part AS nivel,
                    pe.categoria_part AS categoria
                FROM equipes_torneio e
                LEFT JOIN participantes_equipe pe ON pe.id_equipe = e.id_equipe
                LEFT JOIN usuarios u ON u.id_usu = pe.id_usu
                WHERE e.id_torn = ?
                ORDER BY e.nome_equipe, u.nome_usu;
            `, [id]);

            const equipes = [];
            for (const row of rows) {
                let equipe = equipes.find((item) => item.id === row.id_equipe);
                if (!equipe) {
                    equipe = {
                        id: row.id_equipe,
                        nome: row.nome_equipe,
                        descricao: row.desc_equipe,
                        status: row.status_equipe,
                        participantes: []
                    };
                    equipes.push(equipe);
                }
                if (!row.id_part) continue;
                equipe.participantes.push({
                    idParticipacao: row.id_part,
                    id: row.id_usuario,
                    nome: row.nome_usuario,
                    email: row.email_usuario,
                    dataParticipacao: row.data_participacao,
                    status: row.status_participacao,
                    telefone: row.telefone,
                    nivel: row.nivel,
                    categoria: row.categoria
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