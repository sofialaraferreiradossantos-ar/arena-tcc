require("dotenv").config();
const mysql = require("mysql2/promise");

const config = {
  host: process.env.BD_SERVIDOR,
  port: process.env.BD_PORTA || 3306,
  user: process.env.BD_USUARIO,
  password: process.env.BD_SENHA,
  database: process.env.BD_BANCO,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// A pool é criada de forma síncrona para que os controllers recebam a mesma
// referência, mesmo enquanto o teste inicial de conectividade é executado.
const pool = mysql.createPool(config);

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão MySQL estabelecida com sucesso!");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  }
}

initializeDatabase();

module.exports = pool;
