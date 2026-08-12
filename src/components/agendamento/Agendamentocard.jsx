
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import styles from "../../styles/agendamentos.module.css";

function AgendamentoCard({ quadra, data, horario, onCancelar }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>

      <div>
        <h3>
          {quadra}
        </h3>

        <p>
          <FaRegCalendarAlt />

          Data: {data} | Hora: {horario}
        </p>
      </div>


      <div className={styles.cardButtons}>

        <button
          className={styles.cancelButton}
          onClick={onCancelar}
        >
          Excluir
        </button>


        <button
          className={styles.successButton}
          onClick={() => navigate("/sucesso")}
        >
          Ver sucesso
        </button>

      </div>

    </div>
  );
}

export default AgendamentoCard;

