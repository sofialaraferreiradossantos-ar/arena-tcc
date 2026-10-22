import {
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaPen,
} from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";

function AgendamentoCard({ quadra, data, horario, onCancelar, onEditar }) {
  return (
    <article className={styles.card}>
      {/* CABEÇALHO DO CARD */}

      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <FaMapMarkerAlt />
        </div>

        <div>
          <span className={styles.cardLabel}>QUADRA</span>

          <h2 className={styles.cardTitle}>{quadra}</h2>
        </div>
      </div>

      {/* INFORMAÇÕES */}

      <div className={styles.cardInfo}>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FaRegCalendarAlt />
          </div>

          <div>
            <span>Data</span>

            <strong>{data}</strong>
          </div>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FaRegClock />
          </div>

          <div>
            <span>Horário</span>

            <strong>{horario}</strong>
          </div>
        </div>
      </div>

      {/* BOTÕES */}

      <div className={styles.cardFooter}>
        {onEditar && (
          <button
            type="button"
            className={styles.editPrimaryButton}
            onClick={onEditar}
          >
            <FaPen />

            <span>Editar agendamento</span>
          </button>
        )}

        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancelar}
        >
          <FaTrashAlt />

          <span>Cancelar agendamento</span>
        </button>
      </div>
    </article>
  );
}

export default AgendamentoCard;
