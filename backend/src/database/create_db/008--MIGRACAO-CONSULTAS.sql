USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - MIGRAÇÃO DAS CONSULTAS DO MATERIAL
-- Execute uma única vez em bancos criados antes da revisão 002.
-- Não apaga registros existentes.
-- (O banco da escola já recebeu estas colunas: não rode de novo.)
-- =====================================================

ALTER TABLE quadras
    ADD COLUMN imagem_qd VARCHAR(255) NULL AFTER valor_qd,
    ADD COLUMN destaque_qd TINYINT(1) NOT NULL DEFAULT 0 AFTER imagem_qd;

UPDATE quadras
SET
    imagem_qd = CASE id_qd
        WHEN 1 THEN 'quadra1.jpg'
        WHEN 2 THEN 'quadra2.jpg'
        WHEN 3 THEN 'quadra3.jpg'
        ELSE imagem_qd
    END,
    destaque_qd = CASE status_qd
        WHEN 'disponivel' THEN 1
        ELSE 0
    END;

CREATE INDEX idx_quadras_status ON quadras (status_qd);
CREATE INDEX idx_quadras_tipo ON quadras (tipo_qd);
CREATE INDEX idx_quadras_destaque ON quadras (destaque_qd);
