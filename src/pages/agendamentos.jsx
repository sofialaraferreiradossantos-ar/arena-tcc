import { useState } from "react";

import styles from "../styles/agendamentos.module.css";

import HeaderAgendamentos from "../components/agendamento/HeaderAgendamentos";
import AgendamentoTabs from "../components/agendamento/AgendamentoTabs";
import AgendamentoCard from "../components/agendamento/AgendamentoCard";


const todosAgendamentos = [
  {
    id: 1,
    quadra: "Quadra 1",
    data: "15/02/2026",
    horario: "18:00 - 19:30",
    tipo: "anterior",
  },
  {
    id: 2,
    quadra: "Quadra 2",
    data: "17/02/2026",
    horario: "20:00 - 21:30",
    tipo: "proximo",
  },
  {
    id: 3,
    quadra: "Quadra 3",
    data: "17/02/2026",
    horario: "20:00 - 21:30",
    tipo: "proximo",
  },
];


function Agendamentos() {
  const [tabAtiva, setTabAtiva] = useState("anterior");

  const [agendamentos, setAgendamentos] = useState(
    todosAgendamentos
  );


  const filtrados = agendamentos.filter(
    (a) => a.tipo === tabAtiva
  );


  function cancelar(id) {
    setAgendamentos(
      agendamentos.filter((a) => a.id !== id)
    );
  }


  return (
    
    <div className={styles.mainContent}>

      {/* =========================================
          CABEÇALHO
      ========================================= */}

      <HeaderAgendamentos />


      {/* =========================================
          TÍTULO
      ========================================= */}

      <section className={styles.pageTitle}>

        <h1>
          Meus <span>Agendamentos</span>
        </h1>

        <p>
          Confira suas reservas e horários.
        </p>

      </section>


      {/* =========================================
          ABAS
      ========================================= */}

      <AgendamentoTabs
        tabAtiva={tabAtiva}
        onTabChange={setTabAtiva}
      />


      {/* =========================================
          CARDS
      ========================================= */}

      <div className={styles.cardsArea}>

        {filtrados.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              📅
            </div>

            <h2>
              Nenhum agendamento encontrado
            </h2>

            <p>
              Você não possui agendamentos nesta categoria.
            </p>
          </div>
        )}

        


        {filtrados.map((a) => (
          <AgendamentoCard
            key={a.id}
            quadra={a.quadra}
            data={a.data}
            horario={a.horario}
            onCancelar={() => cancelar(a.id)}
          />
        ))}

      </div>

    </div>
  );
}


export default Agendamentos;