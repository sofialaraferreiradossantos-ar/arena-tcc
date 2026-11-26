-- =====================================================
-- 016 - INTEGRANTES POR EQUIPE
-- O administrador define, em cada torneio, quantos integrantes
-- cada equipe tem (2 = duplas). Torneios já cadastrados ficam com 2.
-- Banco novo: não precisa, o 002 já cria a coluna.
-- =====================================================
ALTER TABLE torneios
    ADD COLUMN integrantes_torn INT(11) NOT NULL DEFAULT 2 AFTER limite_part_torn;
