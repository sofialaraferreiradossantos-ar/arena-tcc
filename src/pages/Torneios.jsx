import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/torneios.module.css";
import logo from "../assets/logo.jpeg";
import TorneioCard from "../components/torneios/TorneioCard";
import quadra1 from "../mockup/imagens/quadraCoberta.jpg";

const torneios = [
  {
    id: 1,
    nome: "Torneio de Futevôlei Pro",
    data: "25/05 a 25/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
  {
    id: 2,
    nome: "Torneio de Futevôlei Pro",
    data: "14/06 a 24/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
  {
    id: 3,
    nome: "Torneio de Futevôlei Pro",
    data: "30/05 a 30/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
];

function Torneios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ESCURECE O FUNDO QUANDO O MENU ESTIVER ABERTO */}
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
        {/* BOTÃO DE FECHAR */}
        <button
          className={styles.closeMenu}
          onClick={fecharMenu}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>

        {/* LOGO */}
        <img
          src={logo}
          alt="Arena Beach"
        />

        {/* LINKS */}
        <Link
          to="/home"
          onClick={fecharMenu}
          className={
            location.pathname === "/home"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>🏠</span>
          Início
        </Link>

        <Link
          to="/quadras"
          onClick={fecharMenu}
          className={
            location.pathname === "/quadras"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>🏐</span>
          Quadras
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
          <span className={styles.menuEmoji}>📅</span>
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
          <span className={styles.menuEmoji}>🏆</span>
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
          <span className={styles.menuEmoji}>💳</span>
          Pagamento
        </Link>

        <Link
          to="/"
          onClick={fecharMenu}
          className={styles.sair}
        >
          <span className={styles.menuEmoji}>🚪</span>
          Sair
        </Link>
      </aside>

      {/* CONTEÚDO */}
      <main className={styles.mainContent}>
        {/* BOTÃO PARA ABRIR O MENU */}
        <FaBars
          className={styles.menuIcon}
          onClick={() => setMenuAberto(true)}
        />

        <div className={styles.phoneContainer}>
          <img
            src={logo}
            alt="Arena Beach"
            className={styles.logo}
          />

          <h2>
            Torneios <span>Disponíveis</span>
          </h2>

          <div className={styles.cardsArea}>
            {torneios.map((torneio) => (
              <TorneioCard
                key={torneio.id}
                nome={torneio.nome}
                data={torneio.data}
                local={torneio.local}
                imagem={torneio.imagem}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Torneios;