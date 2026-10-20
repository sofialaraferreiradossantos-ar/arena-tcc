const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const router = require("./src/routes/routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

// tornar a pasta public acessível externamente
app.use("/public", express.static(path.join(__dirname, "public")));

// Erros do upload de imagem (formato inválido, arquivo grande, campo errado)
// devolvem JSON no mesmo padrão das outras respostas da API.
app.use((error, request, response, next) => {
  const erroDeUpload =
    error instanceof multer.MulterError ||
    String(error.message).startsWith("Formato de imagem");

  if (!erroDeUpload) {
    return next(error);
  }

  const mensagens = {
    LIMIT_FILE_SIZE: "A imagem deve ter no máximo 5MB.",
    LIMIT_UNEXPECTED_FILE: `Campo de arquivo '${error.field}' não esperado. Envie a imagem no campo 'imagem_qd'.`,
  };

  return response.status(400).json({
    sucesso: false,
    mensagem: mensagens[error.code] || error.message,
    dados: null,
  });
});

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
  console.log(`Servidor iniciado em http://localhost:${porta}`);
});

app.get("/", (request, response) => {
  response.send("Hello Word");
});
