
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaTrashAlt,
} from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";

function AgendamentoCard({
  quadra,
  data,
  horario,
  onCancelar,
}) {
  return (
    <article className={styles.card}>

      {/* CABEÇALHO DO CARD */}

      <div className={styles.cardHeader}>

        <div className={styles.cardIcon}>
          <FaMapMarkerAlt />
        </div>

        <div>
          <span className={styles.cardLabel}>
            QUADRA
          </span>

          <h2 className={styles.cardTitle}>
            {quadra}
          </h2>
        </div>

      </div>


      {/* INFORMAÇÕES */}

      <div className={styles.cardInfo}>

        <div className={styles.infoItem}>

          <div className={styles.infoIcon}>
            <FaRegCalendarAlt />
          </div>

          <div>
            <span>
              Data
            </span>

            <strong>
              {data}
            </strong>
          </div>

        </div>


        <div className={styles.infoItem}>

          <div className={styles.infoIcon}>
            <FaRegClock />
          </div>

          <div>
            <span>
              Horário
            </span>

            <strong>
              {horario}
            </strong>
          </div>

        </div>

      </div>


      {/* BOTÃO */}

      <div className={styles.cardFooter}>

        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancelar}
        >
          <FaTrashAlt />

          <span>
            Cancelar agendamento
          </span>
        </button>

      </div>

    </article>
  );
}

export default AgendamentoCard;
