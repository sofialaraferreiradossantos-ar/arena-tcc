import styles from '../../styles/quadras.module.css'

import QuadraCard from './QuadraCard'

function QuadrasSection({ quadras }) {
  return (
    <div className={styles.quadrasSection}>

      {quadras.map((quadra) => (
        <QuadraCard
          key={quadra.id}
          title={quadra.title}
          image={quadra.image}
          available={quadra.available}
        />
      ))}

    </div>
  )
}

export default QuadrasSection