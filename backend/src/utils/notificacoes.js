const db = require("../database/Connection");

// =====================================================
// NOTIFICAÇÕES
// Funções usadas pelos controllers para avisar clientes e administradores.
// Um erro ao notificar NUNCA derruba a ação principal (cadastro, reserva...):
// ele só é registrado no log.
// =====================================================

async function criar({ id_usu = null, paraAdmin = false, tipo, titulo, mensagem, link = null, chave = null }) {
    try {
        // INSERT IGNORE + chave_not única: o mesmo lembrete não é criado duas vezes
        await db.query(
            `INSERT IGNORE INTO notificacoes
                (id_usu, para_admin, tipo_not, titulo_not, msg_not, link_not, chave_not)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
                id_usu,
                paraAdmin ? 1 : 0,
                tipo,
                String(titulo).slice(0, 120),
                String(mensagem).slice(0, 300),
                link,
                chave
            ]
        );
    } catch (error) {
        console.error("[notificacoes] Não foi possível criar a notificação:", error.message);
    }
}

// Aviso para todos os administradores
function notificarAdmins(dados) {
    return criar({ ...dados, paraAdmin: true });
}

// Aviso para um cliente
function notificarUsuario(id_usu, dados) {
    return criar({ ...dados, id_usu });
}

// Lembretes dos torneios em que o cliente está inscrito e que acontecem
// nos próximos 7 dias. Gera no máximo um aviso por etapa: "em X dias",
// "amanhã" e "hoje". Roda quando o cliente consulta as notificações,
// então não precisa de nenhum agendador rodando no servidor.
async function gerarLembretesTorneio(id_usu) {
    const [torneios] = await db.query(
        `
            SELECT DISTINCT
                t.id_torn,
                t.nome_torn,
                DATE_FORMAT(t.dt_torn, '%d/%m/%Y') AS data,
                DATEDIFF(t.dt_torn, CURDATE()) AS dias
            FROM participantes_equipe pe
            INNER JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
            INNER JOIN torneios t ON t.id_torn = e.id_torn
            WHERE pe.id_usu = ?
              AND pe.status_part <> 'cancelado'
              AND t.status_torn NOT IN ('cancelado', 'encerrado', 'finalizado')
              AND t.dt_torn BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);
        `,
        [id_usu]
    );

    for (const torneio of torneios) {
        const dias = Number(torneio.dias);
        const etapa = dias === 0 ? "hoje" : dias === 1 ? "amanha" : "semana";
        const quando = dias === 0 ? "é hoje" : dias === 1 ? "é amanhã" : `é em ${dias} dias`;

        await notificarUsuario(id_usu, {
            tipo: "torneio_proximo",
            titulo: `${torneio.nome_torn} ${quando}!`,
            mensagem: `Seu torneio ${quando} (${torneio.data}). Chegue com antecedência para o aquecimento. Bom jogo!`,
            link: "/torneios",
            chave: `torneio-${torneio.id_torn}-usu-${id_usu}-${etapa}`
        });
    }
}

module.exports = { notificarAdmins, notificarUsuario, gerarLembretesTorneio };
