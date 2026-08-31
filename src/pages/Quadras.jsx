import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import styles from "../styles/home.module.css";

import Header from "../components/quadra/Header";
import CategoryButtons from "../components/quadra/CategoryButtons";
import SearchBar from "../components/quadras/SearchBar";
import QuadrasSection from "../components/quadra/QuadrasSection";
import Pagination from "../components/quadra/Pagination";

import logo from "../assets/logo.jpeg";

import quadra1 from "../assets/quadra1.jpg";
import quadra2 from "../assets/quadra2.jpg";
import quadra3 from "../assets/quadra3.jpg";

function Quadras() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(0);

  const [menuAberto, setMenuAberto] = useState(false);

  const location = useLocation();

  const quadras = [
    {
      id: 1,
      title: "Quadra 1",
      type: "Beach Tennis",
      image: quadra1,
      available: true,
    },

    {
      id: 2,
      title: "Quadra 2",
      type: "Futevôlei",
      image: quadra2,
      available: false,
    },

    {
      id: 3,
      title: "Quadra 3",
      type: "Beach Tennis",
      image: quadra3,
      available: true,
    },
  ];

  const filteredQuadras = quadras.filter((quadra) => {
    const matchesSearch =
      quadra.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "Todos" ||
      quadra.type === category;

    return matchesSearch && matchesCategory;
  });

  const cardsPerPage = 3;

  const startIndex =
    currentPage * cardsPerPage;

  const selectedQuadras =
    filteredQuadras.slice(
      startIndex,
      startIndex + cardsPerPage
    );

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className={styles.container}>

      {/* FUNDO ESCURO AO ABRIR O MENU */}
      {menuAberto && (
        <div
          className={styles.menuOverlay}
          onClick={fecharMenu}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`${styles.sidebarMenu} ${
          menuAberto ? styles.open : ""
        }`}
      >

        <button
          className={styles.closeMenu}
          onClick={fecharMenu}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>

        <img
          src={logo}
          alt="Arena Beach"
        />

        <Link
          to="/home"
          onClick={fecharMenu}
          className={
            location.pathname === "/home"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏠
          </span>

          Início
        </Link>

        <Link
          to="/quadra"
          onClick={fecharMenu}
          className={
            location.pathname === "/quadra"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏐
          </span>

          Quadras
        </Link>

        <Link
          to="/agendar-horario"
          onClick={fecharMenu}
          className={
            location.pathname === "/agendar-horario"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🕐
          </span>

          Agendar Horário
        </Link>

        <Link
          to="/agendamentos"
          onClick={fecharMenu}
          className={
            location.pathname === "/agendamentos"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            📅
          </span>

          Agendamentos
        </Link>

        <Link
          to="/torneios"
          onClick={fecharMenu}
          className={
            location.pathname === "/torneios"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏆
          </span>

          Torneios
        </Link>

        <Link
          to="/pagamento"
          onClick={fecharMenu}
          className={
            location.pathname === "/pagamento"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            💳
          </span>

          Pagamento
        </Link>

        <Link
          to="/"
          onClick={fecharMenu}
          className={styles.sair}
        >
          <span className={styles.menuEmoji}>
            🚪
          </span>

          Sair
        </Link>

      </aside>

{/* BOTÃO PARA ABRIR */}
{!menuAberto && (
  <div
    className={styles.menuIcon}
    onClick={() => setMenuAberto(true)}
  >
    ☰
  </div>
)}

{/* MENU LATERAL */}
<div
  className={`${styles.sidebarMenu} ${
    menuAberto ? styles.open : ""
  }`}
>
  {/* BOTÃO PARA FECHAR */}
  <button
    className={styles.closeMenu}
    onClick={() => setMenuAberto(false)}
  >
    ×
  </button>

  <img
    src={logo}
    alt="Arena Beach"
  />

  <Link to="/home">
    🏠 Início
  </Link>

  <Link to="/quadra">
    ⚽ Quadras
  </Link>

  <Link to="/agendar-horario">
    🕐 Agendar Horário
  </Link>

  <Link to="/agendamentos">
    📅 Agendamentos
  </Link>

  <Link to="/torneios">
    🏆 Torneios
  </Link>

  <Link to="/pagamento">
    💳 Pagamento
  </Link>

  <Link to="/cadastro">
    🚪 Sair
  </Link>
</div>
      {/* CONTEÚDO DA PÁGINA */}
      <div className={styles.app}>

        <Header />

        <CategoryButtons
          category={category}
          setCategory={setCategory}
        />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <QuadrasSection
          quadras={selectedQuadras}
        />

        <Pagination
          total={
            Math.ceil(
              filteredQuadras.length /
              cardsPerPage
            )
          }
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </div>

    </div>
  );
}

export default Quadras;