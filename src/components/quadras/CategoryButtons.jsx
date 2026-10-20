import styles from "../../styles/home.module.css";
import { modalidades } from "../../mockup/dados.js";

export default function CategoryButtons({ categoria, setCategoria }) {
  return (
    <div className={styles.categoryButtons} aria-label="Modalidades">
      {modalidades.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={categoria === id ? styles.activeBtn : ""}
          aria-pressed={categoria === id}
          onClick={() => setCategoria(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
