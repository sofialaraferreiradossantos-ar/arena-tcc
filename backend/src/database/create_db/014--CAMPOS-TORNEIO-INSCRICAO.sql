USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - CAMPOS DO TORNEIO E DA INSCRIÇÃO
-- Execute uma única vez, depois do 013. Não apaga registros existentes.
--
-- TORNEIOS: as telas de torneio mostram modalidade, categoria e local.
--   modalidade_torn -> 'Futevôlei' ou 'Beach Tennis'
--   categoria_torn  -> 'Feminino', 'Masculino' ou 'Misto'
--   local_torn      -> quadra onde o torneio acontece (ex.: 'Quadra 1')
--
-- PARTICIPANTES_EQUIPE: a tela de inscrição pede telefone, nível e categoria
-- de quem se inscreve (cada participante tem os seus).
--   telefone_part   -> telefone de contato do participante
--   nivel_part      -> 'Iniciante', 'Intermediário' ou 'Avançado'
--   categoria_part  -> 'A', 'B', 'C' ou 'D'
--
-- As colunas aceitam nulo porque os registros antigos não têm esses dados.
-- =====================================================

ALTER TABLE torneios
    ADD COLUMN modalidade_torn VARCHAR(20) NULL AFTER valor_part,
    ADD COLUMN categoria_torn  VARCHAR(20) NULL AFTER modalidade_torn,
    ADD COLUMN local_torn      VARCHAR(20) NULL AFTER categoria_torn;

ALTER TABLE participantes_equipe
    ADD COLUMN telefone_part  VARCHAR(20) NULL AFTER status_part,
    ADD COLUMN nivel_part     VARCHAR(20) NULL AFTER telefone_part,
    ADD COLUMN categoria_part VARCHAR(20) NULL AFTER nivel_part;

-- Torneios de exemplo do 005 (a descrição já dizia a modalidade)
UPDATE torneios
SET modalidade_torn = 'Futevôlei', categoria_torn = 'Misto', local_torn = 'Quadra 1'
WHERE nome_torn = 'Copa Arena Beach 2026' AND modalidade_torn IS NULL;

UPDATE torneios
SET modalidade_torn = 'Beach Tennis', categoria_torn = 'Misto', local_torn = 'Quadra 2'
WHERE nome_torn = 'Beach Tennis Open' AND modalidade_torn IS NULL;
