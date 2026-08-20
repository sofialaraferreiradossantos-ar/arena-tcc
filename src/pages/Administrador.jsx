import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/administrador.module.css";

function Administrador() {
  const [menuAberto, setMenuAberto] = useState(false);

  const cards = [
    { icon: "👥", label: "Usuários", desc: "Gerenciar usuários" },
    { icon: "▦", label: "Quadras", desc: "Gerenciar quadras" },
    { icon: "📅", label: "Agendamentos", desc: "Gerenciar agendamentos" },
    { icon: "🏆", label: "Torneios", desc: "Gerenciar torneios" },
    { icon: "📊", label: "Relatórios", desc: "Ver estatísticas" },
    { icon: "⚙️", label: "Configurações", desc: "Configurações do sistema" },
  ];

  return (
    <div className={styles.mainContent}>

      {/* HEADER */}
      <header className={styles.topHeader}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuAberto(true)}
        >
          ☰
        </button>

        <div className={styles.logoArea}>
          <h2>
            ARENA <span>BEACH</span>
          </h2>
        </div>

        <div className={styles.userIcon}>👤</div>
      </header>

      {/* OVERLAY + SIDEBAR */}
      {menuAberto && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${menuAberto ? styles.open : ""}`}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setMenuAberto(false)}
        >
          ✕
        </button>

        <div className={styles.sidebarBrand}>
          <strong>ARENA BEACH</strong>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/home" onClick={() => setMenuAberto(false)}>Início</Link>
          <Link to="/quadra" onClick={() => setMenuAberto(false)}>Quadras</Link>
          <Link to="/agendamentos" onClick={() => setMenuAberto(false)}>Agendamentos</Link>
          <Link to="/torneios" onClick={() => setMenuAberto(false)}>Torneios</Link>
          <Link to="/administrador" className={styles.active} onClick={() => setMenuAberto(false)}>
            Administrador
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link to="/login" onClick={() => setMenuAberto(false)}>Sair do sistema</Link>
        </div>
      </aside>

      {/* TÍTULO */}
      <div className={styles.pageTitle}>
        <h1>
          Olá, <span>Administrador!</span>
        </h1>
        <p>Gerencie as informações do sistema.</p>
      </div>

      {/* CARDS */}
      <section className={styles.cardsArea}>
        {cards.map((c) => (
          <div className={styles.card} key={c.label}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <div>
                <span className={styles.cardLabel}>{c.label}</span>
                <h3 className={styles.cardTitle}>{c.desc}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}

export default Administrador;
