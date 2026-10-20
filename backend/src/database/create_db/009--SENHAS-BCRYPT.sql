-- =====================================================
-- ARENA BEACH - SENHAS CRIPTOGRAFADAS (BCRYPT)
-- O hash do bcrypt tem 60 caracteres; as colunas de senha
-- tinham só 20. Execute uma única vez em bancos já criados,
-- ANTES de rodar src/scripts/migrate-passwords.js.
-- =====================================================

ALTER TABLE usuarios
    MODIFY COLUMN senha_usu VARCHAR(60) NOT NULL;

ALTER TABLE administradores
    MODIFY COLUMN senha_adm VARCHAR(60) NOT NULL;
