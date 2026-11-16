-- =====================================================
-- ARENA BEACH - RECURSOS ADICIONAIS
-- Índices para otimizar consultas frequentes e views
-- para facilitar relatórios/telas do sistema
-- =====================================================

-- --------------------------------------------------
-- ÍNDICES
-- (aceleram buscas e filtros usados com frequência
-- nas telas de agendamento e torneios)
-- --------------------------------------------------
CREATE INDEX idx_agendamentos_data ON agendamentos (dt_agend);
CREATE INDEX idx_agendamentos_status ON agendamentos (status_agend);
CREATE INDEX idx_disponibilidades_dia ON disponibilidades (dia_semana);
CREATE INDEX idx_torneios_status ON torneios (status_torn);
CREATE INDEX idx_pagamentos_status ON pagamentos (status_pag);

-- --------------------------------------------------
-- VIEW: Agendamentos detalhados
-- Junta agendamento + usuário + quadra + pagamento
-- útil para a tela "Meus Agendamentos"
-- --------------------------------------------------
CREATE VIEW vw_agendamentos_detalhados AS
SELECT
    a.id_agend,
    a.dt_agend,
    a.hora_inicio,
    a.hora_fim,
    a.status_agend,
    u.id_usu,
    u.nome_usu,
    q.id_qd,
    q.nome_qd,
    q.tipo_qd,
    p.id_pag,
    p.valor_pag,
    p.forma_pag,
    p.status_pag
FROM agendamentos a
JOIN usuarios u ON u.id_usu = a.id_usu
JOIN quadras q  ON q.id_qd = a.id_qd
LEFT JOIN pagamentos p ON p.id_agend = a.id_agend;

-- --------------------------------------------------
-- VIEW: Torneios com quantidade de equipes inscritas
-- útil para a tela de listagem de torneios
-- --------------------------------------------------
CREATE VIEW vw_torneios_resumo AS
SELECT
    t.id_torn,
    t.nome_torn,
    t.dt_torn,
    t.status_torn,
    t.limite_part_torn,
    COUNT(e.id_equipe) AS total_equipes_inscritas
FROM torneios t
LEFT JOIN equipes_torneio e ON e.id_torn = t.id_torn
GROUP BY t.id_torn, t.nome_torn, t.dt_torn, t.status_torn, t.limite_part_torn;

-- --------------------------------------------------
-- VIEW: Participantes por equipe
-- útil para a tela de inscrição de torneio
-- --------------------------------------------------
CREATE VIEW vw_participantes_equipe AS
SELECT
    pe.id_part,
    e.id_equipe,
    e.nome_equipe,
    e.id_torn,
    u.id_usu,
    u.nome_usu,
    pe.status_part
FROM participantes_equipe pe
JOIN equipes_torneio e ON e.id_equipe = pe.id_equipe
JOIN usuarios u ON u.id_usu = pe.id_usu;