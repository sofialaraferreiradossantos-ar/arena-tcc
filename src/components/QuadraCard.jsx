import styles from '../styles/home.module.css'
import quadra from '../assets/quadra.jpeg'

function QuadraCard({ title, available }) {
  return (
    <div className={styles.quadraCard}>

      <img
        src={quadra}
        alt=""
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
        {available ? '🟢 Disponível' : '🔴 Indisponível'}
      </div>

    </div>
  )
}

export default QuadraCard