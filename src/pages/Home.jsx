import { useState } from "react";
import styles from "../styles/home.module.css";
import CategoryButtons from "../components/quadras/CategoryButtons.jsx";
import SearchBar from "../components/quadras/SearchBar.jsx";
import QuadrasSection from "../components/quadras/QuadrasSection.jsx";
import { quadrasMckp } from "../mockup/dados.js";

export default function Quadras() {
  const [search, setSearch] = useState("");
  const quadras = quadrasMckp.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  return <div className={styles.container}>
    <main className={`${styles.app} ${styles.courtsPage}`}>
      <header className={styles.listingIntro}>
        <span className={styles.eyebrow}>Escolha seu espaço</span>
        <h1>Nossas <span>quadras</span></h1>
        <p>Encontre a estrutura ideal para sua próxima partida.</p>
      </header>
      <section className={styles.listingControls} aria-label="Filtros das quadras">
        <CategoryButtons />
        <SearchBar search={search} setSearch={setSearch} />
      </section>
      <div className={styles.resultsHeader}>
        <h2>Quadras disponíveis</h2>
        <span>{quadras.length} {quadras.length === 1 ? "resultado" : "resultados"}</span>
      </div>
      <QuadrasSection quadras={quadras} />
      {quadras.length === 0 && <p className={styles.emptyState}>Nenhuma quadra encontrada.</p>}
    </main>
  </div>;
}
