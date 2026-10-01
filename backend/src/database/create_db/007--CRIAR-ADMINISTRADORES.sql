-- =====================================================
-- ARENA BEACH - CONTAS ADMINISTRATIVAS
-- Execute depois dos scripts de criacao das tabelas.
-- =====================================================

CREATE TABLE IF NOT EXISTS administradores (
    id_adm      INT(11)      NOT NULL AUTO_INCREMENT,
    nome_adm    VARCHAR(100) NOT NULL,
    email_adm   VARCHAR(100) NOT NULL,
    senha_adm   VARCHAR(20)  NOT NULL,
    status_adm  VARCHAR(20)  NOT NULL,
    dt_cad      DATE         NOT NULL,
    PRIMARY KEY (id_adm),
    UNIQUE KEY uq_administradores_email (email_adm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
