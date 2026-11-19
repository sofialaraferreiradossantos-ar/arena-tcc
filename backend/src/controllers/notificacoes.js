const db = require("../database/Connection");
const { validarId } = require("../utils/validacoes");
const { gerarLembretesTorneio } = require("../utils/notificacoes");

// Admin vê as notificações dos administradores; cliente vê só as dele.
function filtro(usuario) {
    return usuario.tipo === "admin"
        ? { where: "para_admin = 1", params: [] }
        : { where: "para_admin = 0 AND id_usu = ?", params: [usuario.id_usu] };
}

module.exports = {

    // =====================================================
    // LISTAR - GET /notificacoes (cliente ou admin logado)
    // Devolve as 30 mais recentes e o total de não lidas.
    // =====================================================
    async listar(request, response) {
        try {
            const usuario = request.usuario;

            // Cliente: cria os lembretes de torneio que estiverem no prazo
            if (usuario.tipo !== "admin") {
                await gerarLembretesTorneio(usuario.id_usu).catch((error) =>
                    console.error("[notificacoes] Erro ao gerar lembretes:", error.message)
                );
            }

            const { where, params } = filtro(usuario);

            const [rows] = await db.query(
                `
                    SELECT
                        id_not,
                        tipo_not,
                        titulo_not,
                        msg_not,
                        link_not,
                        lida_not,
                        TIMESTAMPDIFF(SECOND, dt_not, NOW()) AS segundos
                    FROM notificacoes
                    WHERE ${where}
                    ORDER BY dt_not DESC, id_not DESC
                    LIMIT 30;
                `,
                params
            );

            const [[{ naoLidas }]] = await db.query(
                `SELECT COUNT(*) AS naoLidas FROM notificacoes WHERE ${where} AND lida_not = 0;`,
                params
            );

            return response.status(200).json({
                sucesso: true,
                mensagem: "Notificações.",
                naoLidas: Number(naoLidas),
                dados: rows.map((n) => ({
                    id: n.id_not,
                    tipo: n.tipo_not,
                    titulo: n.titulo_not,
                    mensagem: n.msg_not,
                    link: n.link_not,
                    lida: Boolean(n.lida_not),
                    haSegundos: Math.max(0, Number(n.segundos))
                }))
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // MARCAR UMA COMO LIDA - PATCH /notificacoes/:id/lida
    // =====================================================
    async marcarLida(request, response) {
        try {
            const { id } = request.params;

            if (!validarId(id)) {
                return response.status(400).json({ sucesso: false, mensagem: "Notificação inválida.", dados: null });
            }

            const { where, params } = filtro(request.usuario);

            // O filtro garante que ninguém marca notificação de outra pessoa
            await db.query(
                `UPDATE notificacoes SET lida_not = 1 WHERE id_not = ? AND ${where};`,
                [id, ...params]
            );

            return response.status(200).json({ sucesso: true, mensagem: "Notificação lida.", dados: { id: Number(id) } });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    },


    // =====================================================
    // MARCAR TODAS COMO LIDAS - PATCH /notificacoes/lidas
    // =====================================================
    async marcarTodas(request, response) {
        try {
            const { where, params } = filtro(request.usuario);

            await db.query(
                `UPDATE notificacoes SET lida_not = 1 WHERE ${where} AND lida_not = 0;`,
                params
            );

            return response.status(200).json({ sucesso: true, mensagem: "Todas as notificações foram lidas.", dados: null });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro na requisição.", dados: error.message });
        }
    }
};
