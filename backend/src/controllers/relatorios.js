const db = require("../database/Connection");

module.exports = {

    // =====================================================
    // RELATÓRIOS DO PAINEL ADMINISTRATIVO - GET /relatorios (somente admin)
    // Números calculados direto do banco (mês atual).
    // =====================================================
    async resumo(request, response) {
        try {
            const [[reservas]] = await db.query(`
                SELECT COUNT(*) AS total
                FROM agendamentos
                WHERE status_agend <> 'cancelado'
                  AND YEAR(dt_agend) = YEAR(CURDATE()) AND MONTH(dt_agend) = MONTH(CURDATE());
            `);

            const [[receita]] = await db.query(`
                SELECT COALESCE(SUM(p.valor_pag), 0) AS total
                FROM pagamentos p
                INNER JOIN agendamentos a ON a.id_agend = p.id_agend
                WHERE p.status_pag = 'pago'
                  AND YEAR(a.dt_agend) = YEAR(CURDATE()) AND MONTH(a.dt_agend) = MONTH(CURDATE());
            `);

            const [[clientes]] = await db.query(`
                SELECT
                    SUM(status_usu = 'ativo') AS ativos,
                    SUM(YEAR(dt_cad) = YEAR(CURDATE()) AND MONTH(dt_cad) = MONTH(CURDATE())) AS novos
                FROM usuarios
                WHERE tipo_usu = 'cliente';
            `);

            const [[quadras]] = await db.query(`
                SELECT COUNT(*) AS total, SUM(status_qd = 'disponivel') AS disponiveis
                FROM quadras;
            `);

            const [[torneios]] = await db.query(`
                SELECT SUM(status_torn = 'aberto') AS abertos
                FROM torneios;
            `);

            const [[inscricoes]] = await db.query(`
                SELECT
                    SUM(status_part = 'pendente') AS pendentes,
                    SUM(status_part = 'confirmado') AS confirmadas
                FROM participantes_equipe;
            `);

            // Horário com mais reservas (todas as datas, sem as canceladas)
            const [[horario]] = await db.query(`
                SELECT TIME_FORMAT(hora_inicio, '%H:%i') AS hora, COUNT(*) AS total
                FROM agendamentos
                WHERE status_agend <> 'cancelado'
                GROUP BY hora_inicio
                ORDER BY total DESC, hora_inicio
                LIMIT 1;
            `);

            return response.status(200).json({
                sucesso: true,
                mensagem: "Relatório do mês atual.",
                dados: {
                    reservasMes: Number(reservas.total),
                    receitaMes: Number(receita.total),
                    clientesAtivos: Number(clientes.ativos || 0),
                    clientesNovosMes: Number(clientes.novos || 0),
                    quadrasTotal: Number(quadras.total || 0),
                    quadrasDisponiveis: Number(quadras.disponiveis || 0),
                    torneiosAbertos: Number(torneios.abertos || 0),
                    inscricoesPendentes: Number(inscricoes.pendentes || 0),
                    inscricoesConfirmadas: Number(inscricoes.confirmadas || 0),
                    horarioMaisReservado: horario ? horario.hora : null
                }
            });
        } catch (error) {
            return response.status(500).json({ sucesso: false, mensagem: "Erro ao gerar o relatório.", dados: error.message });
        }
    }
};
