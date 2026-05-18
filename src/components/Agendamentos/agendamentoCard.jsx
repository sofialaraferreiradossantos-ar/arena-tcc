import { FaRegCalendarAlt } from 'react-icons/fa'

import styles from '../../styles/agendamentos.module.css'

function agendamentoCard({
  quadra,
  data,
  hora
}) {
  return (
    <div className={styles.card}>

      <div>

        <h2>{quadra}</h2>

        <p>
          <FaRegCalendarAlt />

          Data: {data} | Hora: {hora}
        </p>

      </div>

      <button>
        Cancelar
      </button>

    </div>
  )
}

export default agendamentoCard