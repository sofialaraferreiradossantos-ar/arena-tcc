import { useState } from "react";
import { FaBars } from "react-icons/fa";

import styles from "../../styles/home.module.css";
import QuadraCard from "./QuadraCard";

export default function Quadras() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.app}>

        <div className={styles.topHeader}>
          <FaBars
            className={styles.menuIcon}
            onClick={() =>
              setMenuAberto(!menuAberto)
            }
          />

          <div className={styles.logoArea}>
            <h2>
              Arena <span>Beach</span>
            </h2>
          </div>
        </div>

        <div
          className={`${styles.sidebarMenu} ${
            menuAberto ? styles.open : ""
          }`}
        >
          <a href="/home">🏠 Início</a>
          <a href="/agendamentos">📅 Agendamentos</a>
          <a href="/sobre">ℹ️ Sobre</a>
        </div>

        <div className={styles.quadrasSection}>
          <QuadraCard
            title="Quadra 01"
            available={true}
          />

          <QuadraCard
            title="Quadra 02"
            available={false}
          />

          <QuadraCard
            title="Quadra 03"
            available={true}
          />
        </div>

      </div>
    </div>
  );
}