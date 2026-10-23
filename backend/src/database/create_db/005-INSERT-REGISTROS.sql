-- =====================================================
-- ARENA BEACH - INSERÇÃO DE REGISTROS DE EXEMPLO
-- =====================================================

-- --------------------------------------------------
-- USUARIOS
-- Clientes: a senha de todos é "senha123", gravada já criptografada (hash bcrypt).
-- Administrador: mesma senha do ADMIN_SENHA do .env, também em hash.
-- --------------------------------------------------
INSERT INTO usuarios (nome_usu, email_usu, senha_usu, tipo_usu, status_usu, dt_cad) VALUES
('Sofia Almeida',     'sofia.almeida@email.com',   '$2b$10$az6OmaEYrc8xEiW7uW26Ce06dtwDQPTmaLc8sgtmjaZWHaVdu0Iou',  'cliente', 'ativo', '2025-01-10'),
('Lucas Pereira',     'lucas.pereira@email.com',   '$2b$10$az6OmaEYrc8xEiW7uW26Ce06dtwDQPTmaLc8sgtmjaZWHaVdu0Iou',  'cliente', 'ativo', '2025-01-15'),
('Marina Costa',      'marina.costa@email.com',    '$2b$10$az6OmaEYrc8xEiW7uW26Ce06dtwDQPTmaLc8sgtmjaZWHaVdu0Iou',  'cliente', 'ativo', '2025-02-01'),
('Rafael Souza',      'rafael.souza@email.com',    '$2b$10$az6OmaEYrc8xEiW7uW26Ce06dtwDQPTmaLc8sgtmjaZWHaVdu0Iou',  'cliente', 'ativo', '2025-02-10'),
('Beatriz Lima',      'beatriz.lima@email.com',    '$2b$10$az6OmaEYrc8xEiW7uW26Ce06dtwDQPTmaLc8sgtmjaZWHaVdu0Iou',  'cliente', 'inativo', '2025-03-05'),
('Administrador',     'admin@arena-beach.com',     '$2b$10$jqifi6lL4NDjTvl6gAR70O76mejJX/bXC.7j2aJt6hHLu/XHX828S',  'admin',   'ativo', '2025-01-01');

-- --------------------------------------------------
-- QUADRAS (todas na mesma arena, em Tupã/SP)
-- --------------------------------------------------
INSERT INTO quadras
    (nome_qd, tipo_qd, desc_qd, status_qd, valor_qd, imagem_qd, destaque_qd)
VALUES
('Quadra 1', 'Futevôlei', 'Quadra oficial de futevôlei com areia nivelada', 'disponivel', 80.00, 'quadra1.jpg', 1),
('Quadra 2', 'Beach Tennis', 'Quadra de beach tennis com rede padrão profissional', 'disponivel', 70.00, 'quadra2.jpg', 1),
('Quadra 3', 'Futevôlei', 'Quadra ampla para futevôlei com iluminação noturna', 'indisponivel', 75.00, 'quadra3.jpg', 0),
('Quadra 4', 'Beach Tennis', 'Quadra de beach tennis com iluminação LED', 'disponivel', 70.00, 'quadra2.jpg', 0);

-- --------------------------------------------------
-- DISPONIBILIDADES
-- --------------------------------------------------
INSERT INTO disponibilidades (id_qd, dia_semana, hora_inicio, hora_fim, status_disp) VALUES
(1, 'Segunda-feira', '08:00:00', '22:00:00', 'disponivel'),
(1, 'Terça-feira',   '08:00:00', '22:00:00', 'disponivel'),
(2, 'Segunda-feira', '08:00:00', '20:00:00', 'disponivel'),
(2, 'Quarta-feira',  '08:00:00', '20:00:00', 'disponivel'),
(3, 'Sexta-feira',   '10:00:00', '23:00:00', 'indisponivel'),
(4, 'Sábado',        '08:00:00', '20:00:00', 'disponivel');

-- --------------------------------------------------
-- AGENDAMENTOS
-- --------------------------------------------------
INSERT INTO agendamentos (id_qd, id_usu, dt_agend, hora_inicio, hora_fim, status_agend) VALUES
(1, 1, '2026-09-01', '09:00:00', '10:00:00', 'confirmado'),
(2, 2, '2026-09-02', '18:00:00', '19:00:00', 'confirmado'),
(1, 3, '2026-09-03', '10:00:00', '11:00:00', 'cancelado'),
(3, 4, '2026-09-05', '15:00:00', '16:00:00', 'confirmado');

-- --------------------------------------------------
-- PAGAMENTOS
-- --------------------------------------------------
INSERT INTO pagamentos (id_agend, valor_pag, forma_pag, status_pag) VALUES
(1, 80.00, 'Pix',    'pago'),
(2, 70.00, 'Cartão', 'pago'),
(3, 80.00, 'Pix',    'estornado'),
(4, 75.00, 'Cartão', 'pendente');

-- --------------------------------------------------
-- TORNEIOS
-- --------------------------------------------------
INSERT INTO torneios (nome_torn, dt_torn, desc_torn, status_torn, limite_part_torn, premiacao_torn, dt_cad, valor_part) VALUES
('Copa Arena Beach 2026',   '2026-10-15', 'Torneio aberto de futevôlei, categoria amador', 'aberto',   16, 'Troféu + R$ 1.000,00', '2026-08-01', 50.00),
('Beach Tennis Open',       '2026-11-20', 'Torneio de beach tennis em duplas mistas',           'em breve', 8,  'Troféu + kit esportivo', '2026-08-10', 40.00);

-- --------------------------------------------------
-- EQUIPES_TORNEIO
-- --------------------------------------------------
INSERT INTO equipes_torneio (id_torn, nome_equipe, desc_equipe, status_equipe) VALUES
(1, 'Areia Quente',    'Equipe formada por atletas locais de futevôlei', 'inscrita'),
(1, 'Praia Cheia',     'Equipe mista com foco em categoria amador',           'inscrita'),
(2, 'Dupla Perfeita',  'Dupla de beach tennis inscrita no torneio',           'inscrita');

-- --------------------------------------------------
-- PARTICIPANTES_EQUIPE
-- --------------------------------------------------
INSERT INTO participantes_equipe (id_equipe, id_usu, dt_part, status_part) VALUES
(1, 1, '2026-08-05', 'confirmado'),
(1, 2, '2026-08-05', 'confirmado'),
(2, 3, '2026-08-06', 'confirmado'),
(3, 4, '2026-08-12', 'pendente');
