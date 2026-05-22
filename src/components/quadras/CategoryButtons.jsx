import styles from "../../styles/home.module.css"

function CategoryButtons() {
  return (
    <div className={styles.categoryButtons}>

      <button className={styles.activeBtn}>
        Beach tennis
      </button>

      <button>
        Futevôlei
      </button>

    </div>
  )
}

export default CategoryButtons