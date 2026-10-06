const crypto = require("crypto");
const db = require("../database/Connection");

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

      if (
        !usuarioBanco ||
        usuarioBanco.senha_usu !== senha ||
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

    if (adminEmail && emailNormalizado === adminEmail && senha === adminSenha) {
      const administrador = {
        id_adm: "admin-env",
        nome_adm: "Administrador",
        email_adm: adminEmail,
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
      const [rows] = await db.query(
        "SELECT id_adm, nome_adm, email_adm, senha_adm, status_adm " +
          "FROM administradores WHERE LOWER(email_adm) = ? LIMIT 1;",
        [emailNormalizado],
      );

      const administradorBanco = rows[0];

      if (
        !administradorBanco ||
        administradorBanco.senha_adm !== senha ||
        !statusAtivo(administradorBanco.status_adm)
      ) {
        return response.status(401).json({
          sucesso: false,
          mensagem: "E-mail ou senha administrativos incorretos.",
        });
      }

      const administrador = {
        id_adm: administradorBanco.id_adm,
        nome_adm: administradorBanco.nome_adm,
        email_adm: administradorBanco.email_adm,
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

      if (
        String(nome_adm).length > 100 ||
        emailNormalizado.length > 100 ||
        String(senha_adm).length > 20
      ) {
        return response.status(400).json({
          sucesso: false,
          mensagem:
            "Nome e e-mail podem ter até 100 caracteres; a senha, até 20.",
        });
      }

      const [resultado] = await db.query(
        `INSERT INTO administradores
          (nome_adm, email_adm, senha_adm, status_adm, dt_cad)
         VALUES (?, ?, ?, ?, ?);`,
        [
          String(nome_adm).trim(),
          emailNormalizado,
          String(senha_adm),
          "ativo",
          new Date().toISOString().slice(0, 10),
        ],
      );

      return response.status(201).json({
        sucesso: true,
        mensagem: "Administrador cadastrado com sucesso.",
        dados: { id_adm: resultado.insertId },
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
