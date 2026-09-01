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

-- DISPONIBILIDADES pertence a uma QUADRA
ALTER TABLE disponibilidades
    ADD CONSTRAINT fk_disponibilidades_quadra
    FOREIGN KEY (id_qd) REFERENCES quadras (id_qd)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- AGENDAMENTOS pertence a uma QUADRA e a um USUARIO
ALTER TABLE agendamentos
    ADD CONSTRAINT fk_agendamentos_quadra
    FOREIGN KEY (id_qd) REFERENCES quadras (id_qd)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

ALTER TABLE agendamentos
    ADD CONSTRAINT fk_agendamentos_usuario
    FOREIGN KEY (id_usu) REFERENCES usuarios (id_usu)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- PAGAMENTOS pertence a um AGENDAMENTO
ALTER TABLE pagamentos
    ADD CONSTRAINT fk_pagamentos_agendamento
    FOREIGN KEY (id_agend) REFERENCES agendamentos (id_agend)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- EQUIPES_TORNEIO pertence a um TORNEIO
ALTER TABLE equipes_torneio
    ADD CONSTRAINT fk_equipes_torneio
    FOREIGN KEY (id_torn) REFERENCES torneios (id_torn)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- PARTICIPANTES_EQUIPE pertence a uma EQUIPE e a um USUARIO
ALTER TABLE participantes_equipe
    ADD CONSTRAINT fk_participantes_equipe
    FOREIGN KEY (id_equipe) REFERENCES equipes_torneio (id_equipe)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE participantes_equipe
    ADD CONSTRAINT fk_participantes_usuario
    FOREIGN KEY (id_usu) REFERENCES usuarios (id_usu)
    ON UPDATE CASCADE
    ON DELETE CASCADE;