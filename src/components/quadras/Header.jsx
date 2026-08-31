import { useState } from "react";
import { FaBars, FaTimes, FaRegUserCircle } from "react-icons/fa";
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
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>

        <div className={styles.logoArea}>
          <img
            src={logo}
            alt="Arena Beach"
          />

          <h2>
            {title} <span>{highlight}</span>
          </h2>
        </div>

        <FaRegUserCircle className={styles.userIcon} />
      </header>

      {/* FUNDO ESCURO AO ABRIR O MENU */}
      {menuAberto && (
        <div
          className={styles.sidebarOverlay}
          onClick={fecharMenu}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`${styles.sidebar} ${
          menuAberto ? styles.open : ""
        }`}
      >
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

        <button type="button" className={styles.closeButton} onClick={fecharMenu} aria-label="Fechar menu">
          <FaTimes />
        </button>

        <nav className={styles.sidebarNav}>
          {[
            ["/home", "🏠", "Início"],
            ["/quadra", "🏐", "Quadras"],
            ["/agendamentos", "📅", "Agendamentos"],
            ["/torneios", "🏆", "Torneios"],
            ["/pagamento", "💳", "Pagamento"],
          ].map(([to, icon, label]) => (
            <Link key={to} to={to} onClick={fecharMenu} className={location.pathname === to ? styles.active : ""}>
              <span className={styles.menuEmoji}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link to="/login" onClick={fecharMenu}>
            <span className={styles.menuEmoji}>🚪</span>
            <span>Sair</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

