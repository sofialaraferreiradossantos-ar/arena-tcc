import styles from '../../styles/home.module.css'

function Pagination() {
  return (
    <div className={styles.pagination}>

      <div className={`${styles.dot} ${styles.activeDot}`}></div>

      <div className={styles.dot}></div>

      <div className={styles.dot}></div>

      <div className={styles.dot}></div>

    </div>
  )
}

export default Pagination