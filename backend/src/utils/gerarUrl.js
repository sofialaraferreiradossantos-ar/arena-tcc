const fse = require("fs-extra");
const path = require("path");
const { URL } = require("url"); // Módulo nativo do Node.js para trabalhar com URLs

/**
 * Caminho físico para a pasta 'public' (backend/public).
 */
const PUBLIC_ROOT_PATH = path.join(__dirname, "../../public");

/**
 * Lê a URL base da API a partir das variáveis de ambiente.
 * Fornece um valor padrão caso a variável não esteja definida.
 */
const API_URL = process.env.API_BASE_URL || "http://localhost:3333";

/**
 * Gera uma URL pública e COMPLETA para um recurso (imagem, ícone, etc.).
 * Se o arquivo não existir na pasta, usa o arquivo padrão.
 * @returns {string} A URL completa (ex: 'http://localhost:3333/public/quadras/quadra1.jpg').
 */
function gerarUrl(nomeArquivo, pasta, arquivoPadrao) {
  // basename impede caminhos como "../../.env" vindos do banco
  const arquivo = nomeArquivo ? path.basename(nomeArquivo) : null;
  const arquivoVerificar = arquivo || arquivoPadrao;
  const caminhoFisico = path.join(PUBLIC_ROOT_PATH, pasta, arquivoVerificar);

  let caminhoRelativo;

  // Se um nome de arquivo foi fornecido e ele existe...
  if (arquivo && fse.existsSync(caminhoFisico)) {
    // ...usa o caminho para esse arquivo.
    caminhoRelativo = path.join("/public", pasta, arquivo);
  } else {
    // ...caso contrário, usa o caminho do arquivo padrão.
    caminhoRelativo = path.join("/public", pasta, arquivoPadrao);
  }

  // Garante que o caminho relativo use barras '/'
  const caminhoRelativoFormatado = caminhoRelativo.replace(/\\/g, "/");

  // Constrói a URL completa de forma segura, evitando barras duplas (//)
  const urlCompleta = new URL(caminhoRelativoFormatado, API_URL);

  return urlCompleta.href;
}

// Exporte a nova função
module.exports = { gerarUrl };
