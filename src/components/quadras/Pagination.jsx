import styles from "../../styles/quadras.module.css";

function Pagination({ pagina, setPagina }) {

  return (
    <div className={styles.pagination}>

      <div
        className={`${styles.dot} ${pagina === 1 ? styles.activeDot : ""}`}
        onClick={() => setPagina(1)}
      />

      <div
        className={`${styles.dot} ${pagina === 2 ? styles.activeDot : ""}`}
        onClick={() => setPagina(2)}
      />

      <div
        className={`${styles.dot} ${pagina === 3 ? styles.activeDot : ""}`}
        onClick={() => setPagina(3)}
      />

      <div
        className={`${styles.dot} ${pagina === 4 ? styles.activeDot : ""}`}
        onClick={() => setPagina(4)}
      />

    </div>
  );
}

export default Pagination;