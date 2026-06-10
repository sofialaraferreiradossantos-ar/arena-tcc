import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import styles from "../../styles/torneios.module.css";

function TorneioCard({ nome, data, local, imagem, onVerDetalhes }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h3>{nome}</h3>
        <p><FaCalendarAlt /> Data: {data}</p>
        <p><FaMapMarkerAlt /> {local}</p>
      </div>
      <div className={styles.cardRight}>
        <img src={imagem} alt={nome} />
        <button onClick={onVerDetalhes}>Ver Detalhes</button>
      </div>
    </div>
  );
}

export default TorneioCard;