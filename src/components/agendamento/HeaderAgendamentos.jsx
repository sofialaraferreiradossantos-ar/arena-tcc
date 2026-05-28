import { useState } from "react";
import { FaBars, FaRegUserCircle } from "react-icons/fa";
import styles from "../../styles/agendamentos.module.css";
import logo from "../../assets/logo.jpeg";

function HeaderAgendamentos() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <div className={styles.topHeader}>
        <FaBars
          className={styles.menuIcon}
          onClick={() => setMenuAberto(!menuAberto)}
        />
        <div className={styles.logoArea}>
          <img src={logo} alt="logo" />
          <h2>Meus <span>Agendamentos</span></h2>
        </div>
        <FaRegUserCircle className={styles.userIcon} />
      </div>

      {menuAberto && (
        <div className={styles.sidebar}>
          <a href="/">Home</a>
          <a href="/agendamentos">Meus Agendamentos</a>
          <a href="/quadra">Quadras</a>
        </div>
      )}
    </>
  );
}

export default HeaderAgendamentos;