import quadraCoberta from "../mockup/imagens/quadraCobertaAlta.png";
import quadraDesoberta from "../mockup/imagens/quadraDescobertaAlta.png";
import quadraBeachTennis from "../mockup/imagens/quadraBeachTennis.jpg";

export const modalidades = [
  { id: "beach-tennis", label: "Beach tennis" },
  { id: "futevolei", label: "Futevôlei" },
];

export const quadrasMckp = [
  {
    id: 1,
    title: "Quadra coberta",
    image: quadraCoberta,
    available: true,
    cidade: "Tupa",
    uf: "SP",
    modalidade: "beach-tennis",
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 2,
    title: "Quadra Beach Tennis",
    image: quadraBeachTennis,
    available: true,
    cidade: "Marilia",
    uf: "SP",
    modalidade: "beach-tennis",
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 3,
    title: "Quadra descoberta",
    image: quadraDesoberta,
    available: false,
    cidade: "Tupa",
    uf: "SP",
    modalidade: "beach-tennis",
    destaques: "Iluminação LED • areia selecionada",
  },
  {
    id: 4,
    title: "Quadra Futevôlei Central",
    image: quadraCoberta,
    available: true,
    cidade: "Tupa",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Rede oficial • areia fofa • iluminação noturna",
  },
  {
    id: 5,
    title: "Quadra Futevôlei Arena 2",
    image: quadraBeachTennis,
    available: true,
    cidade: "Marilia",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Rede regulável • areia selecionada",
  },
  {
    id: 6,
    title: "Quadra Futevôlei Treino",
    image: quadraDesoberta,
    available: false,
    cidade: "Tupa",
    uf: "SP",
    modalidade: "futevolei",
    destaques: "Ideal para treinos e aulas • areia fofa",
  },
];
