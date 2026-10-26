-- =====================================================
-- ARENA BEACH - SENHAS CRIPTOGRAFADAS (BCRYPT)
-- O hash do bcrypt tem 60 caracteres; a coluna de senha
-- tinha só 20. Execute uma única vez em bancos já criados,
-- ANTES de rodar src/scripts/migrate-passwords.js.
-- (Bancos criados com o 002 atual já têm VARCHAR(60).)
-- =====================================================

ALTER TABLE usuarios
    MODIFY COLUMN senha_usu VARCHAR(60) NOT NULL;
