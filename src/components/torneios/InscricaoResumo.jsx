import { FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import styles from "../../styles/torneios.module.css";

function InscricaoResumo({ onConfirmar }) {
  return (
    <div className={styles.resumoBox}>
      <h2>Resumo da <span>inscrição</span></h2>

      <p><MdSportsTennis className={styles.resumoIcon} /> Quadra Beach Tennis</p>
      <p><FaCalendarAlt className={styles.resumoIcon} /> 17/02/2026</p>

      <div className={styles.premios}>
        <p><FaTrophy className={styles.resumoIcon} /> Prêmios</p>
        <p>1º Lugar: R$2.000</p>
        <p>2º Lugar: R$1.000</p>
        <p>3º Lugar: R$500</p>
      </div>

      <p className={styles.valor}>Valor da Inscrição: <strong>R$100</strong></p>

      <button className={styles.confirmarBtn} onClick={onConfirmar}>
        Confirmar Inscrição
      </button>
    </div>
  );
}

export default InscricaoResumo;