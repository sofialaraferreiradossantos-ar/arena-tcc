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
];
