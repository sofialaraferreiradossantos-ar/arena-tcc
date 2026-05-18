import styles from '../styles/agendamentos.module.css'

import HeaderAgendamento from '../components/agendamentos/HeaderAgendamento'
import AgendamentoTabs from '../components/agendamentos/AgendamentoTabs'
import AgendamentoCard from '../components/agendamentos/AgendamentoCard'

function Agendamentos() {
  return (
    <div className={styles.container}>

      <div className={styles.app}>

        <HeaderAgendamento />

        <AgendamentoTabs />

        <div className={styles.cardsArea}>

          <AgendamentoCard
            quadra="Quadra 1"
            data="15/02/2026"
            hora="18:00 - 19:30"
          />

          <AgendamentoCard
            quadra="Quadra 2"
            data="17/02/2026"
            hora="20:00 - 21:30"
          />

          <AgendamentoCard
            quadra="Quadra 3"
            data="17/02/2026"
            hora="20:00 - 21:30"
          />

        </div>

      </div>

    </div>
  )
}

export default Agendamentos