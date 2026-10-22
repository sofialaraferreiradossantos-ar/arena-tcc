// Torneios de exemplo, usados na lista, nos detalhes e na inscrição.
// Troque por fetch("/api/torneios") quando o backend estiver pronto.
import quadraCoberta from "./imagens/quadraCoberta.jpg";
import quadraBeachTennis from "./imagens/quadraBeachTennis.jpg";

// Níveis e categorias de jogador aceitos nos torneios. O cliente escolhe os
// dele na inscrição (categoria A = mais forte, D = mais iniciante).
export const NIVEIS = ["Iniciante", "Intermediário", "Avançado"];
export const CATEGORIAS_CLIENTE = ["A", "B", "C", "D"];
export const GENEROS = ["Feminino", "Masculino"];

// "Minha categoria" do cliente (gênero, nível e categoria), salva no
// navegador para filtrar os torneios e preencher a inscrição.
const MINHA_CATEGORIA_KEY = "arena-minha-categoria";

export function carregarMinhaCategoria() {
  try {
    return JSON.parse(localStorage.getItem(MINHA_CATEGORIA_KEY)) || null;
  } catch {
    return null;
  }
}

export function salvarMinhaCategoria(minhaCategoria) {
  try {
    if (minhaCategoria) {
      localStorage.setItem(MINHA_CATEGORIA_KEY, JSON.stringify(minhaCategoria));
    } else {
      localStorage.removeItem(MINHA_CATEGORIA_KEY);
    }
  } catch {
    // Sem acesso ao armazenamento: a escolha vale só nesta visita.
  }
}

// Torneios femininos/masculinos para o gênero escolhido, mais os mistos.
export function torneioCombina(torneio, minhaCategoria) {
  if (!minhaCategoria?.genero) return true;
  return (
    torneio.categoria === "Misto" || torneio.categoria === minhaCategoria.genero
  );
}

export const torneiosMckp = [
  {
    id: 1,
    nome: "Torneio de Futevôlei Pro Feminino",
    modalidade: "Futevôlei",
    categoria: "Feminino",
    data: "25/05 a 25/06",
    local: "Quadra Futevôlei Central",
    horario: "08:00 às 18:00",
    valor: 100,
    premiacao: "R$ 1.000,00",
    participantes: "Até 16 duplas femininas",
    vagas: "16 vagas disponíveis",
    imagem: quadraCoberta,
    descricao:
      "Torneio de Futevôlei Pro na categoria feminina, para atletas que querem competir e viver uma experiência esportiva completa.",
  },
  {
    id: 2,
    nome: "Torneio de Futevôlei Pro Masculino",
    modalidade: "Futevôlei",
    categoria: "Masculino",
    data: "14/06 a 24/06",
    local: "Quadra Futevôlei Arena 2",
    horario: "08:00 às 18:00",
    valor: 100,
    premiacao: "R$ 1.000,00",
    participantes: "Até 16 duplas masculinas",
    vagas: "16 vagas disponíveis",
    imagem: quadraCoberta,
    descricao:
      "Torneio de Futevôlei Pro na categoria masculina, para atletas que querem competir e viver uma experiência esportiva completa.",
  },
  {
    id: 3,
    nome: "Torneio de Futevôlei Pro Misto",
    modalidade: "Futevôlei",
    categoria: "Misto",
    data: "30/05 a 30/06",
    local: "Quadra Futevôlei Praia",
    horario: "08:00 às 18:00",
    valor: 100,
    premiacao: "R$ 1.000,00",
    participantes: "Até 16 duplas mistas",
    vagas: "16 vagas disponíveis",
    imagem: quadraCoberta,
    descricao:
      "Torneio de Futevôlei Pro na categoria mista, com duplas formadas por um homem e uma mulher.",
  },
  {
    id: 4,
    nome: "Beach Tennis Open Feminino",
    modalidade: "Beach tennis",
    categoria: "Feminino",
    data: "08/11 a 30/11",
    local: "Quadra Beach Tennis",
    horario: "08:00 às 18:00",
    valor: 90,
    premiacao: "R$ 1.500,00",
    participantes: "Até 24 duplas femininas",
    vagas: "24 vagas disponíveis",
    imagem: quadraBeachTennis,
    descricao:
      "Torneio aberto de beach tennis na categoria feminina, em duplas. Ideal para quem quer competir e conhecer outras jogadoras da região.",
  },
  {
    id: 5,
    nome: "Beach Tennis Open Masculino",
    modalidade: "Beach tennis",
    categoria: "Masculino",
    data: "15/11 a 16/11",
    local: "Quadra coberta",
    horario: "09:00 às 17:00",
    valor: 80,
    premiacao: "Troféu + kit esportivo",
    participantes: "Até 16 duplas masculinas",
    vagas: "16 vagas disponíveis",
    imagem: quadraCoberta,
    descricao:
      "Torneio de fim de semana de beach tennis na categoria masculina, disputado na quadra coberta. Jogos rápidos e muita resenha entre as partidas.",
  },
  {
    id: 6,
    nome: "Beach Tennis Open Misto",
    modalidade: "Beach tennis",
    categoria: "Misto",
    data: "29/11",
    local: "Quadra Beach Tennis 2",
    horario: "08:00 às 14:00",
    valor: 60,
    premiacao: "Medalhas + kit esportivo",
    participantes: "Até 12 duplas mistas",
    vagas: "12 vagas disponíveis",
    imagem: quadraBeachTennis,
    descricao:
      "Torneio de beach tennis na categoria mista, com duplas formadas por um homem e uma mulher, em clima amistoso.",
  },
];

export function formatarValor(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
