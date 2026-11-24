// Quadras vindas do banco (GET /quadras), no formato usado pelas telas de
// lista e de detalhes das quadras.
import { useEffect, useState } from "react";
import { requisicaoApi } from "./api.js";

// tipo_qd do banco ("Beach Tennis", "Futevôlei") -> id do filtro do site
function modalidadeDoTipo(tipo) {
  const texto = String(tipo || "").toLowerCase();
  if (texto.includes("tennis") || texto.includes("tênis")) return "beach-tennis";
  if (texto.includes("fute")) return "futevolei";
  return null;
}

export function formatarValor(valor) {
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}

function converter(q) {
  const modalidade = modalidadeDoTipo(q.tipo);
  return {
    id: q.id,
    title: q.nome,
    image: q.imagem,
    available: q.disponivel,
    // Todas as quadras são da mesma arena
    cidade: "Tupã",
    uf: "SP",
    modalidade: modalidade ? [modalidade] : [],
    tipo: q.tipo,
    descricao: q.descricao,
    valor: Number(q.valor),
    destaques: `${formatarValor(q.valor)} por hora`,
  };
}

// Lista todas as quadras (disponíveis e indisponíveis)
export function useQuadras() {
  const [quadras, setQuadras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    requisicaoApi("/quadras?disponivel=todos&limit=100")
      .then((resultado) => ativo && setQuadras(resultado.dados.map(converter)))
      .catch((error) => ativo && setErro(error.message))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  return { quadras, carregando, erro };
}
