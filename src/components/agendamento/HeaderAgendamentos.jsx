import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaRegUserCircle } from "react-icons/fa";
import styles from "../../styles/agendamentos.module.css";
import logo from "../../assets/logo.jpeg";

function HeaderAgendamentos() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <FaBars
        className={`${styles.menuIcon} ${
          menuAberto ? styles.menuIconOpen : ""
        }`}
        onClick={() => setMenuAberto(!menuAberto)}
      />

      <div className={styles.topHeader}>
        <div className={styles.logoArea}>
          <img src={logo} alt="logo" />

          <h2>
            Meus <span>Agendamentos</span>
          </h2>
        </div>

        <FaRegUserCircle className={styles.userIcon} />
      </div>

     <div
  className={`${styles.sidebar} ${
    menuAberto ? styles.open : ""
  }`}
>
  <img
    src={logo}
    alt="logo"
    className={styles.sidebarLogo}
  />

  <Link to="/home">🏠 Início</Link>
  <Link to="/quadra">⚽ Quadras</Link>
  <Link to="/agendamentos">📅 Agendamentos</Link>
  <Link to="/torneios">🏆 Torneios</Link>
  <Link to="/pagamento">💳 Pagamento</Link>
  <Link to="/cadastro">🚪 Sair</Link>
</div>
    </>
  );
}

export default HeaderAgendamentos;