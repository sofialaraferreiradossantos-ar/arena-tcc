import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "../styles/navigation.module.css";
import logo from "../assets/logo.jpeg";

const items = [
  ["/home", "🏠", "Início"],
  ["/quadras", "🏐", "Quadras"],
  ["/agendar-horario", "🕐", "Agendar Horário"],
  ["/agendamentos", "📅", "Agendamentos"],
  ["/torneios", "🏆", "Torneios"],
  ["/pagamento", "💳", "Pagamento"],
];

export default function UnifiedMenu() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isAuthPage = ["/", "/cadastro", "/login", "/recuperarSenha", "/sobre"].includes(pathname);
  useEffect(() => {
    document.body.classList.toggle("has-unified-menu", !isAuthPage);
    return () => document.body.classList.remove("has-unified-menu");
  }, [isAuthPage]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (isAuthPage) return null;
  return <>
    <div className={styles.dock}>
      <button className={styles.trigger} onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open}><FaBars /></button>
      <span>Menu</span>
      <Link to="/home" className={styles.dockBrand} aria-label="Arena Beach — página inicial">
        <img src={logo} alt="" />
        <span>ARENA <strong>BEACH</strong></span>
      </Link>
    </div>
    {open && <button className={styles.overlay} onClick={() => setOpen(false)} aria-label="Fechar menu" />}
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`} aria-hidden={!open}>
      <div className={styles.brand}><img src={logo} alt="" /><div><strong>ARENA</strong><span>BEACH</span></div><button onClick={() => setOpen(false)} aria-label="Fechar menu"><FaTimes /></button></div>
      <p className={styles.label}>MENU PRINCIPAL</p>
      <nav>{items.map(([to, emoji, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.active : ""}><span>{emoji}</span>{label}</NavLink>)}</nav>
      <div className={styles.account}><Link to="/login" onClick={() => setOpen(false)}><span>🚪</span>Sair</Link></div>
    </aside>
  </>;
}
