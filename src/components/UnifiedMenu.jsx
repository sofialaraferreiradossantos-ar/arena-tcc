import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUserCog, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../styles/navigation.module.css";
import logo from "../assets/logo.jpeg";

const mainItems = [
  ["/home", "🏠", "Início"],
  ["/quadras", "🏐", "Quadras"],
  ["/agendar-horario", "🕐", "Agendar horário"],
  ["/agendamentos", "📅", "Agendamentos"],
  ["/torneios", "🏆", "Torneios"],
  ["/pagamento", "💳", "Pagamento"],
];

const supportItems = [
  ["/sobre", "ℹ️", "Sobre"],
  ["/administrador", "⚙️", "Administração"],
];

export default function UnifiedMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isPresentationPage = pathname === "/sobre";

  useEffect(() => {
    document.body.classList.add("has-unified-menu");
    return () => document.body.classList.remove("has-unified-menu");
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const renderLinks = (items) => items.map(([to, emoji, label]) => (
    <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.active : ""}>
      <span>{emoji}</span>{label}
    </NavLink>
  ));

  return <>
    <div className={styles.dock}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((current) => !current)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
        {open ? <FaTimes /> : <FaBars />}
        <span>{open ? "Fechar" : "Menu"}</span>
      </button>
      {!isPresentationPage && <nav className={styles.quickActions} aria-label="Acesso rápido">
        <NavLink to="/administrador" className={styles.quickLink}><FaUserCog /><span>Administração</span></NavLink>
        <NavLink to="/login" className={styles.quickLink}><FaSignInAlt /><span>Entrar</span></NavLink>
        <NavLink to="/cadastro" className={`${styles.quickLink} ${styles.quickLinkPrimary}`}><FaUserPlus /><span>Cadastrar</span></NavLink>
      </nav>}
    </div>
    {open && <button type="button" className={styles.overlay} onClick={() => setOpen(false)} aria-label="Fechar menu" />}
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-label="Menu lateral" aria-hidden={!open}>
      <div className={styles.brand}>
        <img src={logo} alt="Arena Beach" />
        <div><strong>ARENA</strong><span>BEACH</span></div>
      </div>
      <div className={styles.menuScroll}>
        <p className={styles.label}>MENU PRINCIPAL</p>
        <nav>{renderLinks(mainItems)}</nav>
        <p className={styles.label}>OUTROS</p>
        <nav>{renderLinks(supportItems)}</nav>
      </div>
      <div className={styles.account}>
        <p className={styles.accountLabel}>ACESSO</p>
        <NavLink to="/login" onClick={() => setOpen(false)}><span>👤</span>Entrar</NavLink>
        <NavLink to="/cadastro" onClick={() => setOpen(false)}><span>✚</span>Cadastrar</NavLink>
      </div>
    </aside>
  </>;
}
