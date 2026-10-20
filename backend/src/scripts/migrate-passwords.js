// Criptografa (bcrypt) as senhas que ainda estão em texto puro no banco.
// Rode com o servidor parado:  cd src/scripts  ->  node migrate-passwords.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Tabelas que guardam senha: [tabela, coluna id, coluna senha]
const TABELAS = [
    ["usuarios", "id_usu", "senha_usu"],
    ["administradores", "id_adm", "senha_adm"]
];

async function migrate() {
    // 1. Configura a conexão (usa as credenciais do .env)
    const connection = await mysql.createConnection({
        host: process.env.BD_SERVIDOR,
        port: process.env.BD_PORTA || 3306,
        user: process.env.BD_USUARIO,
        password: process.env.BD_SENHA,
        database: process.env.BD_BANCO
    });

    try {
        console.log("Iniciando migração de senhas...");

        for (const [tabela, colunaId, colunaSenha] of TABELAS) {
            // A coluna precisa ter espaço para o hash (60 caracteres)
            const [[coluna]] = await connection.execute(
                `SELECT CHARACTER_MAXIMUM_LENGTH AS tamanho
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
                [tabela, colunaSenha]
            );

            if (!coluna || coluna.tamanho < 60) {
                console.error(`A coluna ${tabela}.${colunaSenha} precisa ser VARCHAR(60). Rode o 009--SENHAS-BCRYPT.sql antes.`);
                return;
            }

            // 2. Busca todos os registros
            const [registros] = await connection.execute(
                `SELECT ${colunaId} AS id, ${colunaSenha} AS senha FROM ${tabela}`
            );

            for (const registro of registros) {
                // Verifica se a senha já está criptografada (bcrypt começa com $2)
                if (!String(registro.senha).startsWith("$2")) {
                    console.log(`Criptografando senha de ${tabela} ID: ${registro.id}`);

                    // 3. Gera o hash
                    const hashedPassword = await bcrypt.hash(String(registro.senha), SALT_ROUNDS);

                    // 4. Atualiza o registro no banco
                    await connection.execute(
                        `UPDATE ${tabela} SET ${colunaSenha} = ? WHERE ${colunaId} = ?`,
                        [hashedPassword, registro.id]
                    );
                }
            }
        }

        console.log("Migração concluída com sucesso!");
    } catch (error) {
        console.error("Erro durante a migração:", error);
    } finally {
        // 5. Fecha a conexão obrigatoriamente
        await connection.end();
    }
}

migrate();
