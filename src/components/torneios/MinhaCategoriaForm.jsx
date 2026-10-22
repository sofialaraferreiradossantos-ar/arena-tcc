import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import styles from "../../styles/torneios.module.css";
import {
  CATEGORIAS_CLIENTE,
  GENEROS,
  NIVEIS,
} from "../../mockup/torneios.js";

const GRUPOS = [
  { campo: "genero", titulo: "Gênero", opcoes: GENEROS },
  { campo: "nivel", titulo: "Nível", opcoes: NIVEIS },
  {
    campo: "categoria",
    titulo: "Categoria",
    opcoes: CATEGORIAS_CLIENTE,
    rotulo: (opcao) => `Categoria ${opcao}`,
  },
];

// Janela para o cliente escolher gênero, nível e categoria (A a D).
function MinhaCategoriaForm({ atual, onSalvar, onLimpar, onFechar }) {
  const [escolha, setEscolha] = useState({
    genero: atual?.genero ?? "",
    nivel: atual?.nivel ?? "",
    categoria: atual?.categoria ?? "",
  });

  useEffect(() => {
    const fecharComEsc = (event) => event.key === "Escape" && onFechar();
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  const completo = escolha.genero && escolha.nivel && escolha.categoria;

  function salvar(event) {
    event.preventDefault();
    if (completo) onSalvar(escolha);
  }

  return (
    <div className={styles.modalOverlay} onClick={onFechar}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-minha-categoria"
        onClick={(event) => event.stopPropagation()}
        onSubmit={salvar}
      >
        <div className={styles.modalHeader}>
          <h2 id="titulo-minha-categoria">Minha categoria</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onFechar}
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        <p className={styles.modalDica}>
          Vamos mostrar os torneios do seu gênero e os mistos, e preencher sua
          inscrição automaticamente. Categoria A é a mais forte e D a mais
          iniciante.
        </p>

        {GRUPOS.map(({ campo, titulo, opcoes, rotulo }) => (
          <fieldset key={campo} className={styles.grupoEscolha}>
            <legend>{titulo}</legend>
            <div className={styles.opcoes}>
              {opcoes.map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  aria-pressed={escolha[campo] === opcao}
                  className={`${styles.opcao} ${
                    escolha[campo] === opcao ? styles.opcaoActive : ""
                  }`}
                  onClick={() =>
                    setEscolha((atualEscolha) => ({
                      ...atualEscolha,
                      [campo]: opcao,
                    }))
                  }
                >
                  {rotulo ? rotulo(opcao) : opcao}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className={styles.modalFooter}>
          {atual && (
            <button
              type="button"
              className={styles.limparCategoria}
              onClick={onLimpar}
            >
              Limpar
            </button>
          )}
          <button
            type="submit"
            className={styles.confirmarCategoria}
            disabled={!completo}
          >
            Salvar minha categoria
          </button>
        </div>
      </form>
    </div>
  );
}

export default MinhaCategoriaForm;
