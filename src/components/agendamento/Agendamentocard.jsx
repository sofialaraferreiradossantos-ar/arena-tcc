import { FaRegCalendarAlt } from "react-icons/fa";
import styles from "../../styles/agendamentos.module.css";

function AgendamentoCard({ quadra, data, horario, onCancelar }) {
  return (
    <div className={styles.card}>
      <div>
        <h3>{quadra}</h3>
        <p>
          <FaRegCalendarAlt />
          Data: {data} | Hora: {horario}
        </p>
      </div>
      <button onClick={onCancelar}>
        Cancelar
      </button>
    </div>
  );
}

export default AgendamentoCard;