import { NavLink } from "react-router-dom";
import styles from "./ArenaBeach.module.css";

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  logo,
}) {
  const fecharMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {menuOpen && (
        <div
          className={styles.menuOverlay}
          onClick={fecharMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebarMenu} ${
          menuOpen ? styles.open : ""
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

          <button
            type="button"
            className={styles.closeMenu}
            onClick={fecharMenu}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <NavLink
            to="/"
            end
            onClick={fecharMenu}
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <span className={styles.menuEmoji}>🏠</span>
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/quadras"
            onClick={fecharMenu}
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <span className={styles.menuEmoji}>⚽</span>
            <span>Quadras</span>
          </NavLink>

          <NavLink
            to="/agendamentos"
            onClick={fecharMenu}
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <span className={styles.menuEmoji}>🗓️</span>
            <span>Agendamentos</span>
          </NavLink>

          <NavLink
            to="/torneios"
            onClick={fecharMenu}
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <span className={styles.menuEmoji}>🏆</span>
            <span>Torneios</span>
          </NavLink>

          <NavLink
            to="/pagamento"
            onClick={fecharMenu}
            className={({ isActive }) =>
              isActive ? styles.active : ""
            }
          >
            <span className={styles.menuEmoji}>💳</span>
            <span>Pagamento</span>
          </NavLink>
        </nav>

        <div className={styles.sair}>
          <NavLink
            to="/logout"
            onClick={fecharMenu}
          >
            <span className={styles.menuEmoji}>🚪</span>
            <span>Sair</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
