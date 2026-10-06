-- =====================================================
-- ARENA BEACH - DEFINIÇÃO DOS RELACIONAMENTOS (FOREIGN KEYS)
-- Execute depois de 002-CRIAR_TABELAS.sql
-- =====================================================

-- QUADRAS pertence a uma CIDADE
ALTER TABLE quadras
    ADD CONSTRAINT fk_quadras_cidade
    FOREIGN KEY (id_cidade) REFERENCES cidades (id_cidade)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
