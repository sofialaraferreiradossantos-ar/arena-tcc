const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../database/Connection");
const { validarEmail } = require("../utils/validacoes");

const SALT_ROUNDS = 10;
const sessoes = new Map();

function statusAtivo(status) {
  const valor = String(status ?? "")
    .trim()
    .toLowerCase();
  return valor !== "" && !["0", "inativo", "inactive", "false"].includes(valor);
}

function criarSessao(usuario) {
  const token = crypto.randomUUID();

  sessoes.set(token, {
    usuario,
    criadaEm: Date.now(),
  });

  return token;
}

function obterToken(request) {
  const autorizacao = request.headers.authorization;

  if (autorizacao?.startsWith("Bearer ")) {
    return autorizacao.slice(7);
  }

  return request.headers["x-session-token"];
}

module.exports = {
  async login(request, response) {
    const { email, senha } = request.body || {};
    const emailNormalizado = String(email || "")
      .trim()
      .toLowerCase();

    if (!emailNormalizado || !senha) {
      return response.status(400).json({
        sucesso: false,
        mensagem: "Informe o e-mail e a senha.",
      });
    }

    try {
      const [rows] = await db.query(
        "SELECT id_usu, nome_usu, email_usu, senha_usu, status_usu " +
          "FROM usuarios WHERE LOWER(email_usu) = ? LIMIT 1;",
        [emailNormalizado],
      );

      const usuarioBanco = rows[0];

      // Compara a senha digitada com o hash salvo no banco (bcrypt)
      const senhaCorreta = usuarioBanco
        ? await bcrypt.compare(String(senha), usuarioBanco.senha_usu)
        : false;

      if (
        !usuarioBanco ||
        !senhaCorreta ||
        !statusAtivo(usuarioBanco.status_usu)
      ) {
        return response.status(401).json({
          sucesso: false,
          mensagem: "E-mail ou senha incorretos.",
        });
      }

      const usuario = {
        id_usu: usuarioBanco.id_usu,
        nome_usu: usuarioBanco.nome_usu,
        email_usu: usuarioBanco.email_usu,
        tipo: "usuario",
      };

      return response.status(200).json({
        sucesso: true,
        mensagem: "Login realizado com sucesso.",
        token: criarSessao(usuario),
        usuario,
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível realizar o login.",
        dados: error.message,
      });
    }
  },

  async adminLogin(request, response) {
    const { email, senha } = request.body || {};
    const emailNormalizado = String(email || "")
      .trim()
      .toLowerCase();

    if (!emailNormalizado || !senha) {
      return response.status(400).json({
        sucesso: false,
        mensagem: "Informe o e-mail e a senha.",
      });
    }

    const adminEmail = String(process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();
    const adminSenha = process.env.ADMIN_SENHA || "";

    // Acesso de emergência configurado no .env
    if (adminEmail && emailNormalizado === adminEmail && senha === adminSenha) {
      const administrador = {
        id_usu: "admin-env",
        nome_usu: "Administrador",
        email_usu: adminEmail,
        tipo: "admin",
      };

      return response.status(200).json({
        sucesso: true,
        mensagem: "Login administrativo realizado com sucesso.",
        token: criarSessao(administrador),
        usuario: administrador,
      });
    }

    try {
      // Administrador é um usuário com tipo_usu = 'admin' (conforme o MER)
      const [rows] = await db.query(
        "SELECT id_usu, nome_usu, email_usu, senha_usu, tipo_usu, status_usu " +
          "FROM usuarios WHERE LOWER(email_usu) = ? LIMIT 1;",
        [emailNormalizado],
      );

      const usuarioBanco = rows[0];

      const senhaCorreta = usuarioBanco
        ? await bcrypt.compare(String(senha), usuarioBanco.senha_usu)
        : false;

      if (
        !usuarioBanco ||
        !senhaCorreta ||
        !statusAtivo(usuarioBanco.status_usu)
      ) {
        return response.status(401).json({
          sucesso: false,
          mensagem: "E-mail ou senha administrativos incorretos.",
        });
      }

      if (usuarioBanco.tipo_usu !== "admin") {
        return response.status(403).json({
          sucesso: false,
          mensagem: "Este usuário não tem acesso administrativo.",
        });
      }

      const administrador = {
        id_usu: usuarioBanco.id_usu,
        nome_usu: usuarioBanco.nome_usu,
        email_usu: usuarioBanco.email_usu,
        tipo: "admin",
      };

      return response.status(200).json({
        sucesso: true,
        mensagem: "Login administrativo realizado com sucesso.",
        token: criarSessao(administrador),
        usuario: administrador,
      });
    } catch (error) {
      return response.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível realizar o login administrativo.",
        dados: error.message,
      });
    }
  },

  async adminCadastro(request, response) {
    try {
      const { nome_adm, email_adm, senha_adm } = request.body || {};
      const emailNormalizado = String(email_adm || "")
        .trim()
        .toLowerCase();

      if (!nome_adm || !emailNormalizado || !senha_adm) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "Nome, e-mail e senha são obrigatórios.",
        });
      }

      if (String(nome_adm).length > 100 || !validarEmail(emailNormalizado) || emailNormalizado.length > 100) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "Nome com até 100 caracteres e um e-mail válido são obrigatórios.",
        });
      }

      if (String(senha_adm).length < 6 || String(senha_adm).length > 20) {
        return response.status(400).json({
          sucesso: false,
          mensagem: "A senha deve ter entre 6 e 20 caracteres.",
        });
      }

      const [emailExiste] = await db.query(
        "SELECT id_usu FROM usuarios WHERE LOWER(email_usu) = ?;",
        [emailNormalizado],
      );

      if (emailExiste.length > 0) {
        return response.status(409).json({
          sucesso: false,
          mensagem: "Este e-mail já está cadastrado.",
        });
      }

      const hashedPassword = await bcrypt.hash(String(senha_adm), SALT_ROUNDS);

      // O administrador é gravado em usuarios com tipo_usu = 'admin'
      const [resultado] = await db.query(
        `INSERT INTO usuarios
          (nome_usu, email_usu, senha_usu, tipo_usu, status_usu, dt_cad)
         VALUES (?, ?, ?, 'admin', 'ativo', ?);`,
        [
          String(nome_adm).trim(),
          emailNormalizado,
          hashedPassword,
          new Date().toLocaleDateString("sv-SE"),
        ],
      );

      return response.status(201).json({
        sucesso: true,
        mensagem: "Administrador cadastrado com sucesso.",
        dados: { id_usu: resultado.insertId, tipo_usu: "admin" },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return response.status(409).json({
          sucesso: false,
          mensagem: "Este e-mail administrativo já está cadastrado.",
        });
      }

      return response.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível realizar o cadastro administrativo.",
        dados: error.message,
      });
    }
  },

  logout(request, response) {
    const token = obterToken(request);

    if (token) {
      sessoes.delete(token);
    }

    return response.status(200).json({
      sucesso: true,
      mensagem: "Sessão encerrada.",
    });
  },

  sessaoAtual(request, response) {
    const token = obterToken(request);
    const sessao = token ? sessoes.get(token) : null;

    if (!sessao) {
      return response.status(401).json({
        sucesso: false,
        mensagem: "Sessão inválida ou expirada.",
      });
    }

    return response.status(200).json({
      sucesso: true,
      usuario: sessao.usuario,
    });
  },
};
