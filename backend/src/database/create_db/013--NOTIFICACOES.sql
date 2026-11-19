USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - NOTIFICAÇÕES
-- Execute uma única vez, depois do 012. Não apaga registros existentes.
--
-- Para o CLIENTE (id_usu preenchido, para_admin = 0):
--   torneio_proximo   -> lembrete quando o torneio dele está chegando
--
-- Para os ADMINISTRADORES (id_usu NULL, para_admin = 1):
--   pedido_admin      -> alguém pediu acesso de administrador
--   novo_cliente      -> alguém criou uma conta no site
--   inscricao_torneio -> alguém se inscreveu em um torneio
--   nova_reserva      -> reserva de quadra paga e confirmada
--   reserva_cancelada -> cliente cancelou uma reserva
--
-- As notificações de administrador são compartilhadas: quando um admin
-- marca como lida, ela fica lida para todos.
-- chave_not evita repetir o mesmo lembrete (ex.: torneio-2-usu-4-amanha).
-- =====================================================

CREATE TABLE notificacoes (
    id_not      INT(11)       NOT NULL AUTO_INCREMENT,
    id_usu      INT(11)       NULL,
    para_admin  TINYINT(1)    NOT NULL DEFAULT 0,
    tipo_not    VARCHAR(30)   NOT NULL,
    titulo_not  VARCHAR(120)  NOT NULL,
    msg_not     VARCHAR(300)  NOT NULL,
    link_not    VARCHAR(200)  NULL,
    lida_not    TINYINT(1)    NOT NULL DEFAULT 0,
    chave_not   VARCHAR(120)  NULL,
    dt_not      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_not),
    UNIQUE KEY uq_notificacoes_chave (chave_not),
    KEY idx_notificacoes_usuario (id_usu, lida_not),
    KEY idx_notificacoes_admin (para_admin, lida_not),
    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (id_usu) REFERENCES usuarios (id_usu)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
