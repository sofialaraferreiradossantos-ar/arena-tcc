import styles from '../styles/home.module.css'

function QuadraCard({ title, available }) {
  return (
    <div className={styles.quadraCard}>

      <img
        src="https://i.imgur.com/eQp9Z4A.jpeg"
        alt="quadra"
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