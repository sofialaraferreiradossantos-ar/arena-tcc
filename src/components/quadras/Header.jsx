import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import styles from "../../styles/home.module.css";
import logo from "../../assets/logo.jpeg";

const links = [
  ["/home", "Início", "🏠"], ["/quadras", "Quadras", "🏐"],
  ["/agendar-horario", "Agendar Horário", "🕐"], ["/agendamentos", "Agendamentos", "📅"],
  ["/torneios", "Torneios", "🏆"], ["/pagamento", "Pagamento", "💳"],
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuAberto]);
  const close = () => setMenuAberto(false);

  return <>
    <header className={styles.topHeader}>
      <button className={styles.menuButton} onClick={() => setMenuAberto(true)} aria-label="Abrir menu"><FaBars /></button>
      <Link to="/home" className={styles.logoArea} aria-label="Arena Beach — início"><img src={logo} alt="" /><h2>ARENA <span>BEACH</span></h2></Link>
      <nav className={styles.desktopNav} aria-label="Navegação principal"><NavLink to="/quadras">🏐 Quadras</NavLink><NavLink to="/torneios">🏆 Torneios</NavLink><NavLink to="/agendamentos">📅 Agendamentos</NavLink></nav>
      <Link to="/login" className={styles.profileButton} aria-label="Acessar perfil"><FaUserCircle /><span>Minha conta</span></Link>
    </header>
    {menuAberto && <div className={styles.menuOverlay} onClick={close} />}
    <aside className={`${styles.sidebarMenu} ${menuAberto ? styles.open : ""}`} aria-hidden={!menuAberto}>
      <div className={styles.sidebarBrand}><img src={logo} alt="Arena Beach" className={styles.sidebarLogo} /><div className={styles.brandText}><strong>ARENA</strong><strong>BEACH</strong></div><button className={styles.closeMenu} onClick={close} aria-label="Fechar menu"><FaTimes /></button></div>
      <nav className={styles.sidebarNav}>{links.map(([to, label, emoji]) => <NavLink key={to} to={to} onClick={close} className={({ isActive }) => isActive ? styles.active : ""}><span className={styles.menuEmoji}>{emoji}</span><span>{label}</span></NavLink>)}</nav>
      <div className={styles.sair}><Link to="/login" onClick={close}><span className={styles.menuEmoji}>🚪</span><span>Sair</span></Link></div>
    </aside>
  </>;
}
