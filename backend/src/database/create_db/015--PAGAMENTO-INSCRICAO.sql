USE bd_tcc_etim_124_arena;

-- =====================================================
-- ARENA BEACH - PAGAMENTO DA INSCRIÇÃO EM TORNEIO
-- Execute uma única vez, depois do 014.
--
-- 1) PAGAMENTOS passa a registrar dois tipos de pagamento:
--    - reserva de quadra   -> id_agend preenchido, id_part nulo
--    - inscrição em torneio -> id_part preenchido, id_agend nulo
--    O CHECK garante que cada pagamento é de exatamente um dos dois.
--
-- 2) Modalidade, categoria e local do torneio e telefone, nível e
--    categoria do participante passam a ser obrigatórios (NOT NULL).
--    Antes, os registros antigos recebem valores para não ficarem nulos.
-- =====================================================

-- Torneios de teste do CRUD: ficam inativos (não aparecem no site)
UPDATE torneios
SET modalidade_torn = COALESCE(modalidade_torn, 'Futevôlei'),
    categoria_torn  = COALESCE(categoria_torn, 'Misto'),
    local_torn      = COALESCE(local_torn, 'Quadra 3'),
    status_torn     = 'inativo'
WHERE nome_torn IN ('Torneio Teste', 'Torneio Teste Editado');

UPDATE torneios
SET modalidade_torn = COALESCE(modalidade_torn, 'Futevôlei'),
    categoria_torn  = COALESCE(categoria_torn, 'Misto'),
    local_torn      = COALESCE(local_torn, 'Quadra 1')
WHERE modalidade_torn IS NULL OR categoria_torn IS NULL OR local_torn IS NULL;

-- Participantes de exemplo (005) recebem dados fictícios
UPDATE participantes_equipe
SET telefone_part  = COALESCE(telefone_part, CONCAT('(14) 90000-', LPAD(id_part, 4, '0'))),
    nivel_part     = COALESCE(nivel_part, 'Intermediário'),
    categoria_part = COALESCE(categoria_part, 'B')
WHERE telefone_part IS NULL OR nivel_part IS NULL OR categoria_part IS NULL;

ALTER TABLE torneios
    MODIFY modalidade_torn VARCHAR(20) NOT NULL,
    MODIFY categoria_torn  VARCHAR(20) NOT NULL,
    MODIFY local_torn      VARCHAR(20) NOT NULL;

ALTER TABLE participantes_equipe
    MODIFY telefone_part  VARCHAR(20) NOT NULL,
    MODIFY nivel_part     VARCHAR(20) NOT NULL,
    MODIFY categoria_part VARCHAR(20) NOT NULL;

ALTER TABLE pagamentos
    MODIFY id_agend INT(11) NULL,
    ADD COLUMN id_part INT(11) NULL AFTER id_agend,
    ADD CONSTRAINT fk_pagamentos_participacao
        FOREIGN KEY (id_part) REFERENCES participantes_equipe (id_part)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    ADD CONSTRAINT ck_pagamentos_origem
        CHECK ((id_agend IS NOT NULL AND id_part IS NULL) OR (id_agend IS NULL AND id_part IS NOT NULL));

-- Quadras de teste com nome repetido/provisório
UPDATE quadras SET nome_qd = 'Quadra 4' WHERE nome_qd = 'Quadra Teste Editada';
UPDATE quadras SET nome_qd = 'Quadra 6' WHERE id_qd = 6 AND nome_qd = 'Quadra 5';
