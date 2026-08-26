import { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import styles from "../../styles/home.module.css";

import logo from "../../assets/logo.jpeg";

export default function Header({ title = "ARENA", highlight = "BEACH" }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <>
      {/* BARRA DE TOPO */}
      <header className={styles.topHeader}>
        <div
          className={styles.menuButton}
          onClick={() => setMenuAberto(true)}
          role="button"
          aria-label="Abrir menu"
        >
          <FaBars />
        </div>

        <div className={styles.logoArea}>
          <img
            src={logo}
            alt="Arena Beach"
          />

          <h2>
            {title} <span>{highlight}</span>
          </h2>
        </div>

        <FaUserCircle className={styles.userIcon} />
      </header>

      {/* FUNDO ESCURO AO ABRIR O MENU */}
      {menuAberto && (
        <div
          className={styles.menuOverlay}
          onClick={fecharMenu}
        />
      )}

      {/* MENU LATERAL */}
      <div
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

        <div className={styles.sidebarBrand}>
          <img
            src={logo}
            alt="Arena Beach"
            className={styles.sidebarLogo}
          />

          <div className={styles.brandText}>
            <strong>ARENA</strong>
            <strong>BEACH</strong>
          </div>
        </div>

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
      </div>
    </>
  );
}

