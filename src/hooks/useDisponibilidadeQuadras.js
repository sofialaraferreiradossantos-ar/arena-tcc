import { useEffect, useState } from "react";

const apiUrl = (path) =>
  `${(import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")}${path}`;

// Busca no back-end (GET /quadras) se cada quadra está disponível.
// Devolve um objeto { [id]: true/false }. Enquanto carrega, ou se o
// back-end estiver desligado, devolve null e a página usa os dados de exemplo.
export default function useDisponibilidadeQuadras() {
  const [disponibilidade, setDisponibilidade] = useState(null);

  useEffect(() => {
    let ativo = true;

    fetch(apiUrl("/quadras?disponivel=todos&limit=100"))
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((resultado) => {
        if (!ativo || !resultado?.sucesso) return;
        const mapa = {};
        resultado.dados.forEach((quadra) => {
          mapa[quadra.id] = quadra.disponivel;
        });
        setDisponibilidade(mapa);
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, []);

  return disponibilidade;
}

// Junta a quadra de exemplo com a disponibilidade que veio do banco.
export function comDisponibilidade(quadra, disponibilidade) {
  if (!disponibilidade || disponibilidade[quadra.id] === undefined) {
    return quadra;
  }
  return { ...quadra, available: disponibilidade[quadra.id] };
}
