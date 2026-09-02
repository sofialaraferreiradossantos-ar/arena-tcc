import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import styles from "../../styles/home.module.css";
import fallback from "../../assets/quadra.jpeg";

export default function QuadraCard({ id, title, image = fallback, available }) {
  const navigate = useNavigate();
  const open = () => navigate(`/quadra/${id}`);

  return <article className={styles.quadraCard} onClick={open} role="link" tabIndex={0} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && open()}>
    <div className={styles.courtImageWrap}>
      <img src={image} alt={title} />
      <span className={`${styles.status} ${available ? styles.available : styles.unavailable}`}>{available ? "Disponível" : "Indisponível"}</span>
    </div>
    <div className={styles.courtCardBody}>
      <small>BEACH TENNIS</small>
      <h3>{title}</h3>
      <p>Iluminação LED • areia selecionada</p>
      <span className={styles.cardLink}>Ver detalhes <FaArrowRight /></span>
    </div>
  </article>;
}
