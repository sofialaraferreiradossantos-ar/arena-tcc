import styles from '../../styles/agendamentos.module.css'

function agendamentoTabs() {
  return (
    <div className={styles.tabs}>

      <button className={styles.activeTab}>
        Anterior
      </button>

      <button>
        Próximo
      </button>

    </div>
  )
}

export default agendamentoTabs