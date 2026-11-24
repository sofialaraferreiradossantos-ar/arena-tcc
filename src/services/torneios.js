// Torneios vindos do banco (GET /torneios), no formato usado pelas telas
// de lista, detalhes e inscrição.
import { requisicaoApi } from "./api.js";
import quadraCoberta from "../mockup/imagens/quadraCoberta.jpg";
import quadraBeachTennis from "../mockup/imagens/quadraBeachTennis.jpg";

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

function converter(t) {
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
    // O banco não guarda foto do torneio: usa uma imagem da arena
    imagem: /tennis/i.test(`${t.nome_torn} ${t.desc_torn}`)
      ? quadraBeachTennis
      : quadraCoberta,
  };
}

// Torneios inativos (excluídos pelo administrador) não aparecem para o cliente
export async function buscarTorneios() {
  const resultado = await requisicaoApi("/torneios");
  return resultado.dados
    .filter((t) => t.status_torn !== "inativo")
    .map(converter);
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
