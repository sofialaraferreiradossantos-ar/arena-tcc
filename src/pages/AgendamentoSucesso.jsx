
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/agendamentos.module.css";
import quadra from "../mockup/imagens/quadra.jpeg";

function AgendamentoSucesso() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navegar = (rota) => {
    closeMenu();
    navigate(rota);
  };

  const sair = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <div className={styles.page}>

      {/* ================================
          BOTÃO MENU
      ================================= */}

      <button
        className={styles.menuIcon}
        onClick={toggleMenu}
        aria-label="Abrir menu"
      >
        ☰
      </button>


      {/* ================================
          OVERLAY
      ================================= */}

      {menuOpen && (
        <div
          className={styles.menuOverlay}
          onClick={closeMenu}
        />
      )}


      {/* ================================
          MENU LATERAL
      ================================= */}

      <aside
        className={`${styles.sidebar} ${
          menuOpen ? styles.open : ""
        }`}
      >

        <button
          className={styles.closeMenu}
          onClick={closeMenu}
          aria-label="Fechar menu"
        >
          ×
        </button>


        <img
          className={styles.sidebarLogo}
          src="/logo.png"
          alt="Arena Beach"
        />


        {/* HOME */}

        <a
          href="/home"
          onClick={(e) => {
            e.preventDefault();
            navegar("/home");
          }}
        >
          🏠
          <span>Home</span>
        </a>


        {/* QUADRAS */}

        <a
          href="/quadras"
          onClick={(e) => {
            e.preventDefault();
            navegar("/quadras");
          }}
        >
          🏟️
          <span>Quadras</span>
        </a>


        {/* AGENDAMENTOS */}

        <a
          href="/agendamentos"
          onClick={(e) => {
            e.preventDefault();
            navegar("/agendamentos");
          }}
        >
          📅
          <span>Agendamentos</span>
        </a>


        {/* SOBRE */}

        <a
          href="/sobre"
          onClick={(e) => {
            e.preventDefault();
            navegar("/sobre");
          }}
        >
          ℹ️
          <span>Sobre</span>
        </a>


        {/* SAIR */}

        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            sair();
          }}
        >
          🚪
          <span>Sair</span>
        </a>

      </aside>


      {/* ================================
          HEADER
      ================================= */}

      <header className={styles.topHeader}>

        <div className={styles.logoArea}>

          <img
            src="/logo.png"
            alt="Arena Beach"
          />

          <h2>
            ARENA <span>BEACH</span>
          </h2>

        </div>


        {/* USUÁRIO */}

        <button
          className={styles.userIcon}
          onClick={() => navegar("/perfil")}
          aria-label="Perfil"
        >
          👤
        </button>

      </header>


      {/* ================================
          TELA DE SUCESSO
      ================================= */}

      <main className={styles.successContainer}>

        <div className={styles.successCard}>

          <div className={styles.checkIcon}>
            ✓
          </div>


          <h1>
            Agendamento realizado com sucesso!
          </h1>


          <p className={styles.successMessage}>
            Sua reserva foi confirmada
          </p>


          {/* RESUMO */}

          <div className={styles.resumeBox}>

            <h2>
              Resumo do agendamento
            </h2>


            <div className={styles.resumeContent}>

              <img
                src={quadra}
                alt="Quadra Beach Tennis"
              />


              <div className={styles.resumeInfo}>

                <p>
                  <strong>Quadra:</strong>
                  <span>
                    Quadra Beach Tennis
                  </span>
                </p>


                <p>
                  <strong>Data:</strong>
                  <span>
                    17/02/2026
                  </span>
                </p>


                <p>
                  <strong>Horário:</strong>
                  <span>
                    19:00 às 20:00
                  </span>
                </p>

              </div>

            </div>

          </div>


          {/* BOTÃO */}

          <button
            className={styles.viewButton}
            onClick={() => navegar("/agendamentos")}
          >
            Ver agendamento
          </button>

        </div>

      </main>

    </div>
  );
}

export default AgendamentoSucesso;

