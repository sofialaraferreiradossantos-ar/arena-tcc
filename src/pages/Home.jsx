import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/home.module.css";
import CategoryButtons from "../components/quadras/CategoryButtons.jsx";
import SearchBar from "../components/quadras/SearchBar.jsx";
import QuadrasSection from "../components/quadras/QuadrasSection.jsx";
import { modalidades, temModalidade } from "../mockup/dados.js";
import { useQuadras } from "../services/quadras.js";

export default function Quadras() {
  const [search, setSearch] = useState("");
  // A modalidade fica na URL (?modalidade=futevolei) para poder ser linkada.
  const [searchParams, setSearchParams] = useSearchParams();
  const modalidade =
    modalidades.find((item) => item.id === searchParams.get("modalidade")) ||
    modalidades[0];
  const setCategoria = (id) => setSearchParams({ modalidade: id });
  // Quadras do banco de dados (GET /quadras)
  const { quadras: todasQuadras, carregando, erro } = useQuadras();

  const quadras = todasQuadras
    .filter(
      (item) =>
        temModalidade(item, modalidade.id) &&
        item.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className={styles.container}>
      <main className={`${styles.app} ${styles.courtsPage}`}>
        <header className={styles.listingIntro}>
          <span className={styles.eyebrow}>Escolha seu espaço</span>
          <h1>
            Nossas <span>quadras</span>
          </h1>
          <p>Encontre a estrutura ideal para sua próxima partida.</p>
        </header>
        <section
          className={styles.listingControls}
          aria-label="Filtros das quadras"
        >
          <CategoryButtons
            categoria={modalidade.id}
            setCategoria={setCategoria}
          />
          <SearchBar search={search} setSearch={setSearch} />
        </section>
        <div className={styles.resultsHeader}>
          <h2>Quadras de {modalidade.label.toLowerCase()}</h2>
          <span>
            {quadras.length} {quadras.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
        <QuadrasSection quadras={quadras} />
        {carregando && <p className={styles.emptyState}>Carregando quadras...</p>}
        {erro && (
          <p className={styles.emptyState} role="alert">
            {erro}
          </p>
        )}
        {!carregando && !erro && quadras.length === 0 && (
          <p className={styles.emptyState}>
            Nenhuma quadra de {modalidade.label.toLowerCase()} encontrada.
          </p>
        )}
      </main>
    </div>
  );
}
