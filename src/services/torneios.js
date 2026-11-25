// Torneios vindos do banco (GET /torneios), no formato usado pelas telas
// de lista, detalhes e inscrição.
import { requisicaoApi } from "./api.js";
import quadra1 from "../mockup/imagens/quadra1.jpg";
import quadra2 from "../mockup/imagens/quadra2.jpg";
import quadra3 from "../mockup/imagens/quadra3.jpg";

// Fotos da arena usadas quando não há foto de quadra cadastrada
const FOTOS_ARENA = [quadra1, quadra2, quadra3];

const STATUS_TEXTO = {
  aberto: "Inscrições abertas",
  "em breve": "Em breve",
  "em andamento": "Em andamento",
  encerrado: "Encerrado",
};

export function formatarData(dataISO) {
  if (!dataISO) return "—";
  const [ano, mes, dia] = String(dataISO).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarValor(valor) {
  if (valor === null || valor === undefined) return "Gratuito";
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}

// O banco não tem coluna de gênero do torneio: ele é lido do nome/descrição
// ("feminino", "masculino", "misto"). Sem essa informação, vale para todos.
function generoDoTorneio(t) {
  const texto = `${t.nome_torn} ${t.desc_torn}`.toLowerCase();
  if (texto.includes("mist")) return "Misto";
  if (texto.includes("feminin")) return "Feminino";
  if (texto.includes("masculin")) return "Masculino";
  return null;
}

// Mesmo filtro de antes: torneios do gênero escolhido, mistos e os sem gênero
export function torneioCombina(torneio, minhaCategoria) {
  if (!minhaCategoria?.genero || !torneio.categoria) return true;
  return torneio.categoria === "Misto" || torneio.categoria === minhaCategoria.genero;
}

function converter(t, fotosQuadras = []) {
  const limite = t.limite_part_torn ? Number(t.limite_part_torn) : null;
  const inscritos = Number(t.inscritos || 0);
  const vagasRestantes = limite === null ? null : Math.max(0, limite - inscritos);

  return {
    id: t.id_torn,
    nome: t.nome_torn,
    categoria: generoDoTorneio(t),
    data: formatarData(t.dt_torn),
    descricao: t.desc_torn,
    status: t.status_torn,
    statusTexto: STATUS_TEXTO[t.status_torn] || t.status_torn,
    premiacao: t.premiacao_torn || "A definir",
    valor: t.valor_part === null ? null : Number(t.valor_part),
    limite,
    inscritos,
    vagasTexto:
      limite === null
        ? "Sem limite de vagas"
        : `${vagasRestantes} de ${limite} vagas disponíveis`,
    aceitaInscricao:
      t.status_torn === "aberto" && (vagasRestantes === null || vagasRestantes > 0),
    imagem: imagemDoTorneio(t, fotosQuadras),
  };
}

// O banco não guarda foto do torneio: cada torneio recebe a foto de uma das
// quadras cadastradas, em rodízio pelo id, para os cards não ficarem iguais.
// Sem fotos de quadra, usa as fotos fixas da arena no mesmo rodízio.
function imagemDoTorneio(t, fotosQuadras) {
  const fotos = fotosQuadras.length > 0 ? fotosQuadras : FOTOS_ARENA;
  return fotos[Number(t.id_torn) % fotos.length];
}

// Fotos das quadras (sem a imagem padrão de quadra sem foto). Se a busca
// falhar, os torneios continuam aparecendo com as imagens fixas.
async function buscarFotosQuadras() {
  try {
    const resultado = await requisicaoApi("/quadras?disponivel=todos&limit=100");
    const fotos = resultado.dados
      .map((q) => q.imagem)
      .filter((url) => url && !url.includes("sem-imagem"));
    return [...new Set(fotos)];
  } catch {
    return [];
  }
}

// Torneios inativos (excluídos pelo administrador) não aparecem para o cliente
export async function buscarTorneios() {
  const [resultado, fotosQuadras] = await Promise.all([
    requisicaoApi("/torneios"),
    buscarFotosQuadras(),
  ]);
  return resultado.dados
    .filter((t) => t.status_torn !== "inativo")
    .map((t) => converter(t, fotosQuadras));
}

export async function buscarTorneio(id) {
  const torneios = await buscarTorneios();
  return torneios.find((t) => t.id === Number(id)) || null;
}

// Grava a equipe e o cliente logado como participante. Nível e categoria do
// jogador não têm coluna própria: ficam registrados na descrição da equipe.
export function inscreverNoTorneio(id, { nome_equipe, desc_equipe, nivel, categoria }) {
  const perfil = `Nível: ${nivel} · Categoria ${categoria}`;
  const extra = String(desc_equipe || "").trim();
  const descricao = (extra ? `${perfil} — ${extra}` : perfil).slice(0, 300);

  return requisicaoApi(`/torneios/${id}/inscricao`, {
    method: "POST",
    autenticado: true,
    body: { nome_equipe, desc_equipe: descricao },
  });
}
