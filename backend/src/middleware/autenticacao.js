const { obterSessao } = require("../controllers/auth");

// Exige um token de sessão válido (Authorization: Bearer <token>).
// O usuário da sessão fica disponível em request.usuario.
function exigirLogin(request, response, next) {
    const sessao = obterSessao(request);

    if (!sessao) {
        return response.status(401).json({
            sucesso: false,
            mensagem: "Sessão inválida ou expirada. Faça login novamente.",
            dados: null
        });
    }

    request.usuario = sessao.usuario;
    return next();
}

function exigirTipo(tipo, mensagem) {
    return (request, response, next) =>
        exigirLogin(request, response, () => {
            if (request.usuario.tipo !== tipo) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem,
                    dados: null
                });
            }
            return next();
        });
}

// Rotas de cliente (ex.: pagar a própria reserva)
const exigirUsuario = exigirTipo("usuario", "Entre com a sua conta de cliente para continuar.");

// Rotas administrativas (ex.: alterar status de pagamentos)
const exigirAdmin = exigirTipo("admin", "Acesso restrito ao administrador.");

module.exports = { exigirLogin, exigirUsuario, exigirAdmin };
