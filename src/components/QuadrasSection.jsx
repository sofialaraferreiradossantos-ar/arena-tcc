import styles from '../styles/home.module.css'

import QuadraCard from './QuadraCard.jsx'

function QuadrasSection() {
  return (
    <div className={styles.quadrasSection}>

      <QuadraCard
        title="Quadra 1"
        available={true}
      />

      <QuadraCard
        title="Quadra 2"
        available={false}
      />

      <QuadraCard
        title="Quadra 3"
        available={true}
      />

    </div>
  )
}

export default QuadrasSection