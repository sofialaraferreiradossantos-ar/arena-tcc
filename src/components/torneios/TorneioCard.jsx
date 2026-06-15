import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/torneios.module.css";

function TorneioCard({ nome, data, local, imagem }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <h3>{nome}</h3>
        <p><FaCalendarAlt /> Data: {data}</p>
        <p><FaMapMarkerAlt /> {local}</p>
      </div>
      <div className={styles.cardRight}>
        <img src={imagem} alt={nome} />
        <button onClick={() => navigate("/quadra")}>
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}

export default TorneioCard;