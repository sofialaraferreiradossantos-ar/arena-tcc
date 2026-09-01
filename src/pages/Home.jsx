import { useState } from "react";
import styles from "../styles/home.module.css";
import Header from "../components/quadras/Header.jsx";
import CategoryButtons from "../components/quadras/CategoryButtons.jsx";
import SearchBar from "../components/quadras/SearchBar.jsx";
import QuadrasSection from "../components/quadras/QuadrasSection.jsx";
import Pagination from "../components/quadras/Pagination.jsx";
import { quadrasMckp } from "../mockup/dados.js";

export default function Quadras() {
  const [pagina, setPagina] = useState(0);
  const [search, setSearch] = useState("");
  const quadras = quadrasMckp.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  return <div className={styles.container}><Header /><main className={styles.app}>
    <div className={styles.listingIntro}><span className={styles.eyebrow}>Escolha seu espaço</span><h1>Nossas <span>quadras</span></h1><p>Encontre a estrutura ideal para sua próxima partida.</p></div>
    <CategoryButtons /><SearchBar search={search} setSearch={setSearch} /><QuadrasSection quadras={quadras} />
    {quadras.length === 0 && <p className={styles.emptyState}>Nenhuma quadra encontrada.</p>}
    <Pagination pagina={pagina} setPagina={setPagina} />
  </main></div>;
}
