import styles from "../../styles/home.module.css";

export default function CategoryButtons() {
  return <div className={styles.categoryButtons} aria-label="Modalidades">
    <button type="button" className={styles.activeBtn}>Beach tennis</button>
    <button type="button">Futevôlei</button>
  </div>;
}
