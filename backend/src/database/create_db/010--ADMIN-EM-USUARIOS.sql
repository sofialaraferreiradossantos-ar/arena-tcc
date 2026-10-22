-- =====================================================
-- ARENA BEACH - AJUSTES CONFORME O MER
-- 1) Administrador na tabela usuarios  2) torneios.premiacao_torn
-- O MER não tem tabela de administradores: o administrador é um
-- usuário com tipo_usu = 'admin'. Execute uma única vez em bancos
-- criados antes desta revisão. Bancos criados com o 002 e o 005
-- atuais já estão neste formato.
-- =====================================================

ALTER TABLE usuarios
    ADD COLUMN tipo_usu VARCHAR(20) NOT NULL DEFAULT 'cliente' AFTER senha_usu;

-- Administrador do grupo (senha = ADMIN_SENHA do .env, em hash bcrypt)
INSERT INTO usuarios (nome_usu, email_usu, senha_usu, tipo_usu, status_usu, dt_cad) VALUES
('Administrador', 'admin@arena-beach.com', '$2b$10$jqifi6lL4NDjTvl6gAR70O76mejJX/bXC.7j2aJt6hHLu/XHX828S', 'admin', 'ativo', CURDATE());

-- A tabela antiga deixa de ser usada
DROP TABLE IF EXISTS administradores;

-- Nome da coluna igual ao do MER
ALTER TABLE torneios
    CHANGE COLUMN premiacao premiacao_torn VARCHAR(300) NULL;
