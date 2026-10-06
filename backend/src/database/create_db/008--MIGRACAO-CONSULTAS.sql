-- =====================================================
-- ARENA BEACH - MIGRAÇÃO DAS CONSULTAS DO MATERIAL
-- Execute uma única vez em bancos criados antes da revisão 002.
-- Não apaga registros existentes.
-- =====================================================

CREATE TABLE IF NOT EXISTS cidades (
    id_cidade    INT(11)      NOT NULL AUTO_INCREMENT,
    nome_cidade  VARCHAR(100) NOT NULL,
    uf           CHAR(2)      NOT NULL,
    PRIMARY KEY (id_cidade),
    UNIQUE KEY uq_cidades_nome_uf (nome_cidade, uf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO cidades (nome_cidade, uf) VALUES
    ('Tupã', 'SP'),
    ('Marilia', 'SP'),
    ('São Jose do Rio Preto', 'SP'),
    ('Bauru', 'SP'),
    ('Ourinhos', 'SP');

ALTER TABLE quadras
    ADD COLUMN id_cidade INT(11) NULL AFTER id_qd,
    ADD COLUMN imagem_qd VARCHAR(255) NULL AFTER valor_qd,
    ADD COLUMN destaque_qd TINYINT(1) NOT NULL DEFAULT 0 AFTER imagem_qd;

UPDATE quadras
SET
    id_cidade = CASE id_qd
        WHEN 1 THEN (SELECT id_cidade FROM cidades WHERE nome_cidade = 'Tupã' AND uf = 'SP')
        WHEN 2 THEN (SELECT id_cidade FROM cidades WHERE nome_cidade = 'Marilia' AND uf = 'SP')
        ELSE (SELECT id_cidade FROM cidades WHERE nome_cidade = 'Tupã' AND uf = 'SP')
    END,
    imagem_qd = CASE id_qd
        WHEN 1 THEN 'quadra1.jpg'
        WHEN 2 THEN 'quadra2.jpg'
        WHEN 3 THEN 'quadra3.jpg'
        ELSE imagem_qd
    END,
    destaque_qd = CASE status_qd
        WHEN 'disponivel' THEN 1
        ELSE 0
    END
WHERE id_cidade IS NULL;

ALTER TABLE quadras
    MODIFY COLUMN id_cidade INT(11) NOT NULL,
    ADD CONSTRAINT fk_quadras_cidade
        FOREIGN KEY (id_cidade) REFERENCES cidades (id_cidade)
        ON UPDATE CASCADE
        ON DELETE RESTRICT;

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

CREATE INDEX idx_quadras_status ON quadras (status_qd);
CREATE INDEX idx_quadras_tipo ON quadras (tipo_qd);
CREATE INDEX idx_quadras_destaque ON quadras (destaque_qd);
