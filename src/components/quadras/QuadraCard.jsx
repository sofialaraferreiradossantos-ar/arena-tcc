import styles from "../../styles/home.module.css";
import quadra from "../../assets/quadra.jpeg";
import { useNavigate } from "react-router-dom";

function QuadraCard({ title, available }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.quadraCard}
      onClick={() => navigate("/quadra")}
      style={{ cursor: "pointer" }}
    >
      <img
        src={quadra}
        alt="Quadra"
      />

      <h3>{title}</h3>

      <p>Beach Tennis</p>

      <span>Iluminação/terra</span>

      <div
        className={
          available
            ? `${styles.status} ${styles.available}`
            : `${styles.status} ${styles.unavailable}`
        }
      >
        {available
          ? "🟢 Disponível"
          : "🔴 Indisponível"}
      </div>
    </div>
  );
}

export default QuadraCard;