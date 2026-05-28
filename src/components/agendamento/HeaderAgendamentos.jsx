import { FaBars, FaRegUserCircle } from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";

import logo from "../../assets/logo.jpeg";

function HeaderAgendamentos() {
  return (
    <div className={styles.topHeader}>

      <FaBars className={styles.menuIcon} />

      <div className={styles.logoArea}>
        <img src={logo} alt="logo" />

        <h2>
          Meus <span>Agendamentos</span>
        </h2>
      </div>

      <FaRegUserCircle className={styles.userIcon} />

    </div>
  );
}

export default HeaderAgendamentos;