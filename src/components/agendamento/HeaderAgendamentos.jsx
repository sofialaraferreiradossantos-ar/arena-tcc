import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaRegUserCircle,
} from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";
import logo from "../../assets/logo.jpeg";

function HeaderAgendamentos() {
  const [menuAberto, setMenuAberto] = useState(false);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <>
      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header className={styles.topHeader}>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={
            menuAberto
              ? "Fechar menu"
              : "Abrir menu"
          }
        >
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>


        <div className={styles.logoArea}>

          <img
            src={logo}
            alt="Arena Beach"
          />

          <h2>
            Meus <span>Agendamentos</span>
          </h2>

        </div>


        <FaRegUserCircle
          className={styles.userIcon}
        />

      </header>


      {/* =================================================
          FUNDO ESCURO
      ================================================= */}

      {menuAberto && (
        <div
          className={styles.sidebarOverlay}
          onClick={fecharMenu}
        />
      )}


      {/* =================================================
          MENU LATERAL
      ================================================= */}

      <aside
        className={`${styles.sidebar} ${
          menuAberto ? styles.open : ""
        }`}
      >

        {/* =================================================
            LOGO
        ================================================= */}

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


        {/* =================================================
            BOTÃO FECHAR
        ================================================= */}

        <button
          type="button"
          className={styles.closeButton}
          onClick={fecharMenu}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>


        {/* =================================================
            NAVEGAÇÃO
        ================================================= */}

        <nav className={styles.sidebarNav}>

          <Link
            to="/home"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🏠</span>
            <span>Início</span>
          </Link>


          <Link
            to="/quadra"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🏐</span>
            <span>Quadras</span>
          </Link>


          <Link
            to="/agendar-horario"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🕐</span>
            <span>Agendar Horário</span>
          </Link>


          <Link
            to="/agendamentos"
            className={styles.active}
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>📅</span>
            <span>Agendamentos</span>
          </Link>


          <Link
            to="/torneios"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🏆</span>
            <span>Torneios</span>
          </Link>


          <Link
            to="/pagamento"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>💳</span>
            <span>Pagamento</span>
          </Link>

        </nav>


        {/* =================================================
            SAIR
        ================================================= */}

        <div className={styles.sidebarBottom}>

          <Link
            to="/cadastro"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🚪</span>
            <span>Sair</span>
          </Link>

        </div>

      </aside>
    </>
  );
}

export default HeaderAgendamentos;
