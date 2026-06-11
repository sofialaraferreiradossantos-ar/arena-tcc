import { useState } from "react";
import { FaBars } from "react-icons/fa";

import styles from "../../styles/home.module.css";

export default function Quadras() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <FaBars
        className={styles.menuIcon}
        onClick={() => setMenuAberto(!menuAberto)}
      />

      <div
        className={`${styles.sidebarMenu} ${
          menuAberto ? styles.open : ""
        }`}
      >
        <a href="/home">🏠 Início</a>
        <a href="/agendamentos">📅 Agendamentos</a>
        <a href="/sobre">ℹ️ Sobre</a>
      </div>
    </>
  );
}