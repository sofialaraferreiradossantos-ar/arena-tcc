import styles from "../../styles/agendamentos.module.css";

function AgendamentoTabs({ tabAtiva, onTabChange }) {
  return (
    <div className={styles.tabs}>
      <button
        className={tabAtiva === "anterior" ? styles.activeTab : ""}
        onClick={() => onTabChange("anterior")}
      >
        Anterior
      </button>
      <button
        className={tabAtiva === "proximo" ? styles.activeTab : ""}
        onClick={() => onTabChange("proximo")}
      >
        Próximo
      </button>
    </div>
  );
}

export default AgendamentoTabs;