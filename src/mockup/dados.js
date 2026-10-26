import quadraCoberta from "../mockup/imagens/quadraCobertaAlta.png";
import quadraDesoberta from "../mockup/imagens/quadra.jpeg";
import quadraBeachTennis from "../mockup/imagens/quadraBeachTennis.jpg";
// Fotos reais da arena: Quadra 1 (rede rosa), Quadra 2 (rede laranja), Quadra 3 (rede branca)
import fotoQuadra1 from "../mockup/imagens/quadra1.jpg";
import fotoQuadra2 from "../mockup/imagens/quadra2.jpg";
import fotoQuadra3 from "../mockup/imagens/quadra3.jpg";

export const modalidades = [
  { id: "beach-tennis", label: "Beach tennis" },
  { id: "futevolei", label: "Futevôlei" },
];

// Uma quadra pode ter uma modalidade ("futevolei") ou várias
// (["beach-tennis", "futevolei"]). Use as funções abaixo para ler o campo.
export const listaModalidades = (quadra) => [].concat(quadra?.modalidade ?? []);

export const temModalidade = (quadra, id) => listaModalidades(quadra).includes(id);

export const nomesModalidades = (quadra) =>
  listaModalidades(quadra)
    .map((id) => modalidades.find((item) => item.id === id)?.label)
    .filter(Boolean)
    .join(" • ");

export const quadrasMckp = [
  {
    id: 1,
    title: "Quadra 1",
    image: fotoQuadra1,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: ["beach-tennis", "futevolei"],
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 2,
    title: "Quadra 2",
    image: fotoQuadra2,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: ["beach-tennis", "futevolei"],
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 3,
    title: "Quadra 3",
    image: fotoQuadra3,
    available: false,
    cidade: "Tupã",
    uf: "SP",
    modalidade: ["beach-tennis", "futevolei"],
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 7,
    title: "Quadra Beach Tennis 2",
    image: quadraBeachTennis,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: "beach-tennis",
    destaques: "Rede profissional • iluminação LED",
  },
  {
    id: 4,
    title: "Quadra Futevôlei Central",
    image: quadraCoberta,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Rede oficial • areia fofa • iluminação noturna",
  },
  {
    id: 5,
    title: "Quadra Futevôlei Arena 2",
    image: quadraBeachTennis,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Rede regulável • areia selecionada",
  },
  {
    id: 6,
    title: "Quadra Futevôlei Treino",
    image: quadraDesoberta,
    available: false,
    cidade: "Tupã",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Ideal para treinos e aulas • areia fofa",
  },
  {
    id: 8,
    title: "Quadra Futevôlei Praia",
    image: quadraBeachTennis,
    available: true,
    cidade: "Tupã",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Rede oficial • areia selecionada",
  },
];
