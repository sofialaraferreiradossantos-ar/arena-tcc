-- =====================================================
-- ARENA BEACH - CRIAÇÃO DAS TABELAS
-- Baseado no MER (tcc-v2) e no Dicionário de Dados
-- =====================================================

-- --------------------------------------------------
-- USUARIOS
-- --------------------------------------------------
CREATE TABLE usuarios (
    id_usu      INT(11)      NOT NULL AUTO_INCREMENT,
    nome_usu    VARCHAR(100) NOT NULL,
    email_usu   VARCHAR(100) NOT NULL,
    -- Guarda o hash do bcrypt, que tem 60 caracteres
    senha_usu   VARCHAR(60)  NOT NULL,
    -- 'cliente' ou 'admin' (administrador é um usuário com tipo 'admin')
    tipo_usu    VARCHAR(20)  NOT NULL DEFAULT 'cliente',
    status_usu  VARCHAR(20)  NOT NULL,
    dt_cad      DATE         NOT NULL,
    PRIMARY KEY (id_usu),
    UNIQUE KEY uq_usuarios_email (email_usu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- QUADRAS (todas da mesma arena, em Tupã/SP)
-- --------------------------------------------------
CREATE TABLE quadras (
    id_qd       INT(11)        NOT NULL AUTO_INCREMENT,
    nome_qd     VARCHAR(100)   NOT NULL,
    tipo_qd     VARCHAR(50)    NOT NULL,
    desc_qd     VARCHAR(300)   NOT NULL,
    status_qd   VARCHAR(20)    NOT NULL,
    valor_qd    DECIMAL(10,2)  NOT NULL,
    imagem_qd   VARCHAR(255)   NULL,
    destaque_qd TINYINT(1)     NOT NULL DEFAULT 0,
    PRIMARY KEY (id_qd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- DISPONIBILIDADES
-- --------------------------------------------------
CREATE TABLE disponibilidades (
    id_disp      INT(11)      NOT NULL AUTO_INCREMENT,
    id_qd        INT(11)      NOT NULL,
    dia_semana   VARCHAR(20)  NOT NULL,
    hora_inicio  TIME         NOT NULL,
    hora_fim     TIME         NOT NULL,
    status_disp  VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_disp),
    CONSTRAINT fk_disponibilidades_quadra
        FOREIGN KEY (id_qd) REFERENCES quadras (id_qd)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- AGENDAMENTOS
-- --------------------------------------------------
CREATE TABLE agendamentos (
    id_agend     INT(11)      NOT NULL AUTO_INCREMENT,
    id_qd        INT(11)      NOT NULL,
    id_usu       INT(11)      NOT NULL,
    dt_agend     DATE         NOT NULL,
    hora_inicio  TIME         NOT NULL,
    hora_fim     TIME         NOT NULL,
    status_agend VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_agend),
    CONSTRAINT fk_agendamentos_quadra
        FOREIGN KEY (id_qd) REFERENCES quadras (id_qd)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_agendamentos_usuario
        FOREIGN KEY (id_usu) REFERENCES usuarios (id_usu)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- PAGAMENTOS
-- --------------------------------------------------
CREATE TABLE pagamentos (
    id_pag      INT(11)       NOT NULL AUTO_INCREMENT,
    id_agend    INT(11)       NOT NULL,
    valor_pag   DECIMAL(10,2) NOT NULL,
    forma_pag   VARCHAR(50)   NOT NULL,
    status_pag  VARCHAR(20)   NOT NULL,
    PRIMARY KEY (id_pag),
    CONSTRAINT fk_pagamentos_agendamento
        FOREIGN KEY (id_agend) REFERENCES agendamentos (id_agend)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- TORNEIOS
-- --------------------------------------------------
CREATE TABLE torneios (
    id_torn           INT(11)       NOT NULL AUTO_INCREMENT,
    nome_torn         VARCHAR(100)  NOT NULL,
    dt_torn           DATE          NOT NULL,
    desc_torn         VARCHAR(300)  NOT NULL,
    status_torn       VARCHAR(20)   NOT NULL,
    limite_part_torn  INT(11)       NULL,
    premiacao_torn    VARCHAR(300)  NULL,
    dt_cad            DATE          NOT NULL,
    valor_part        DECIMAL(10,2) NULL,
    PRIMARY KEY (id_torn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- EQUIPES_TORNEIO
-- --------------------------------------------------
CREATE TABLE equipes_torneio (
    id_equipe     INT(11)      NOT NULL AUTO_INCREMENT,
    id_torn       INT(11)      NOT NULL,
    nome_equipe   VARCHAR(100) NOT NULL,
    desc_equipe   VARCHAR(300) NOT NULL,
    status_equipe VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_equipe),
    CONSTRAINT fk_equipes_torneio
        FOREIGN KEY (id_torn) REFERENCES torneios (id_torn)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- PARTICIPANTES_EQUIPE
-- --------------------------------------------------
CREATE TABLE participantes_equipe (
    id_part      INT(11)     NOT NULL AUTO_INCREMENT,
    id_equipe    INT(11)     NOT NULL,
    id_usu       INT(11)     NOT NULL,
    dt_part      DATE        NOT NULL,
    status_part  VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_part),
    CONSTRAINT fk_participantes_equipe
        FOREIGN KEY (id_equipe) REFERENCES equipes_torneio (id_equipe)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_participantes_usuario
        FOREIGN KEY (id_usu) REFERENCES usuarios (id_usu)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
