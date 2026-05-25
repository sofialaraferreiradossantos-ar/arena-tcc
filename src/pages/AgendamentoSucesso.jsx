import styles from "../styles/quadras.module.css";

import quadra from "../assets/quadra.jpeg";

function AgendamentoSucesso() {
  return (
    <div className={styles.successContainer}>

      <div className={styles.successCard}>

        <div className={styles.checkIcon}>
          ✓
        </div>

        <h1>
          Agendamento realizado com sucesso!
        </h1>

        <p>Sua reserva foi confirmada</p>

        <div className={styles.resumeBox}>

          <h2>Resumo do agendamento</h2>

          <img src={quadra} alt="quadra" />

          <div className={styles.resumeInfo}>
            <span><strong>Quadra:</strong></span>
            <span>Quadra Beach Tennis</span>

            <span><strong>Data:</strong> 17/02/2026</span>

            <span><strong>Horario:</strong> 19:00 às 20:00</span>
          </div>

        </div>

        <button className={styles.viewButton}>
          Ver agendamento
        </button>

      </div>

    </div>
  );
}

export default AgendamentoSucesso;
