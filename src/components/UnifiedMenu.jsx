import { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUserCog,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// Ícones do Flaticon (UIcons, estilo regular arredondado: classes fi-rr-*)
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import styles from "../styles/navigation.module.css";
import Notificacoes from "./Notificacoes.jsx";
import logo from "../assets/logo.jpeg";

// Ícone do Flaticon dentro do menu lateral
const Icone = ({ nome }) => (
  <span>
    <i className={`fi fi-rr-${nome}`} aria-hidden="true" />
  </span>
);

const mainItems = [
  ["/home", "home", "Início"],
  ["/quadras", "tennis", "Quadras"],
  ["/agendar-horario", "calendar-clock", "Agendar horário"],
  ["/agendamentos", "calendar", "Agendamentos"],
  ["/torneios", "trophy", "Torneios"],
  ["/pagamento", "credit-card", "Pagamento"],
];

const getSupportItems = (adminPath) => [
  ["/sobre", "info", "Sobre"],
  ...(adminPath ? [[adminPath, "settings", "Administração"]] : []),
];

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";

  const savedTheme = window.localStorage.getItem("arena-theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

export default function UnifiedMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  // Botão Voltar aparece em todas as páginas, menos no Início.
  const isInicio = pathname === "/" || pathname === "/home";

  // Volta para a tela anterior. Se a página foi aberta direto pelo
  // endereço (sem histórico), vai para a lista de quadras ou para o Início.
  const voltar = () => {
    // Se o menu estiver aberto, fecha junto com a navegação
    setOpen(false);
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(pathname.startsWith("/quadra/") ? "/quadras" : "/home");
    }
  };
  const isPresentationPage = pathname === "/sobre";
  // Cliente (token_sessao) ou administrador (token_admin) logado: troca
  // Entrar/Cadastrar pelo botão Sair.
  const isAdminAutenticado = Boolean(localStorage.getItem("token_admin"));
  const isClienteAutenticado =
    !isAdminAutenticado && Boolean(localStorage.getItem("token_sessao"));
  const isAutenticado = isAdminAutenticado || isClienteAutenticado;
  // Cliente logado não vê o atalho de Administração.
  const adminPath = isAdminAutenticado
    ? "/administrador"
    : isClienteAutenticado
      ? null
      : "/admin/login";

  useEffect(() => {
    document.body.classList.add("has-unified-menu");
    return () => document.body.classList.remove("has-unified-menu");
  }, []);

  useEffect(() => {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("arena-theme", theme);
  }, [theme]);

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

  const renderLinks = (items) =>
    items.map(([to, icone, label]) => (
      <NavLink
        key={to}
        to={to}
        onClick={() => setOpen(false)}
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <Icone nome={icone} />
        {label}
      </NavLink>
    ));

  return (
    <>
      <div className={styles.dock}>
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <FaTimes /> : <FaBars />}
            <span>{open ? "Fechar" : "Menu"}</span>
          </button>
          <button
            type="button"
            className={`${styles.themeToggle} ${styles.iconButton}`}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            aria-label={
              theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
            }
            aria-pressed={theme === "light"}
            title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          {!isInicio && (
            <button
              type="button"
              className={`${styles.themeToggle} ${styles.iconButton} ${
                open ? styles.escondido : ""
              }`}
              onClick={voltar}
              aria-label="Voltar para a página anterior"
              title="Voltar"
              // Com o menu aberto o botão sai da tela e não pode ser focado
              aria-hidden={open}
              tabIndex={open ? -1 : undefined}
            >
              <FaArrowLeft />
            </button>
          )}
          {!isInicio && (
            <button
              type="button"
              className={`${styles.themeToggle} ${styles.iconButton} ${
                open ? styles.escondido : ""
              }`}
              onClick={() => {
                setOpen(false);
                navigate("/home");
              }}
              aria-label="Ir para o Início"
              title="Início"
              // Igual ao Voltar: some enquanto o menu lateral está aberto
              aria-hidden={open}
              tabIndex={open ? -1 : undefined}
            >
              <FaHome />
            </button>
          )}
        </div>
        {!isPresentationPage && (
          <nav className={styles.quickActions} aria-label="Acesso rápido">
            {isAutenticado && (
              <Notificacoes
                admin={isAdminAutenticado}
                classeBotao={styles.quickLink}
              />
            )}
            {adminPath && (
              <NavLink to={adminPath} className={styles.quickLink}>
                <FaUserCog />
                <span>Administração</span>
              </NavLink>
            )}
            {!isAutenticado && (
              <NavLink to="/login" className={styles.quickLink}>
                <FaSignInAlt />
                <span>Entrar</span>
              </NavLink>
            )}
            {!isAutenticado && (
              <NavLink
                to="/cadastro"
                className={`${styles.quickLink} ${styles.quickLinkPrimary}`}
              >
                <FaUserPlus />
                <span>Cadastrar</span>
              </NavLink>
            )}
            {isAutenticado && (
              <NavLink to="/logout" className={styles.quickLink}>
                <FaSignOutAlt />
                <span>Sair</span>
              </NavLink>
            )}
          </nav>
        )}
      </div>
      {open && (
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <aside
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
        aria-label="Menu lateral"
        aria-hidden={!open}
      >
        <div className={styles.brand}>
          <img src={logo} alt="Arena Beach" />
          <div>
            <strong>ARENA</strong>
            <span>BEACH</span>
          </div>
        </div>
        <div className={styles.menuScroll}>
          <p className={styles.label}>MENU PRINCIPAL</p>
          <nav>{renderLinks(mainItems)}</nav>
          <p className={styles.label}>OUTROS</p>
          <nav>{renderLinks(getSupportItems(adminPath))}</nav>
        </div>
        {!isAutenticado && (
          <div className={styles.account}>
          <p className={styles.accountLabel}>ACESSO</p>
          <NavLink to="/login" onClick={() => setOpen(false)}>
            <Icone nome="user" />
            Entrar
          </NavLink>
          <NavLink to="/cadastro" onClick={() => setOpen(false)}>
            <Icone nome="user-add" />
            Cadastrar
          </NavLink>
          </div>
        )}
        {isAutenticado && (
          <div className={styles.account}>
            <p className={styles.accountLabel}>CONTA</p>
            <NavLink to="/logout" onClick={() => setOpen(false)}>
              <Icone nome="sign-out-alt" />
              Sair
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}
