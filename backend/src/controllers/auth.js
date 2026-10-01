const crypto = require("crypto");
const db = require("../database/connection");

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

    const adminEmail = String(process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();
    const adminSenha = process.env.ADMIN_SENHA || "";

    if (emailNormalizado === adminEmail && senha === adminSenha) {
      const usuario = {
        id_usu: "admin",
        nome_usu: "Administrador",
        email_usu: adminEmail,
        tipo: "admin",
      };

      return response.status(200).json({
        sucesso: true,
        mensagem: "Login administrativo realizado com sucesso.",
        token: criarSessao(usuario),
        usuario,
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
