
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

  const [agendamentos, setAgendamentos] =
    useState(todosAgendamentos);

  const filtrados = agendamentos.filter(
    (agendamento) => agendamento.tipo === tabAtiva
  );

  function cancelar(id) {
    setAgendamentos((agendamentosAtuais) =>
      agendamentosAtuais.filter(
        (agendamento) => agendamento.id !== id
      )
    );
  }

  return (
    <div className={styles.mainContent}>

      <HeaderAgendamentos />

      <main className={styles.content}>

        {/* TÍTULO */}

        <section className={styles.pageTitle}>
          <div className={styles.titleLine}></div>

          <div>
            <h1>
              Meus <span>Agendamentos</span>
            </h1>

            <p>
              Confira suas reservas e horários.
            </p>
          </div>
        </section>


        {/* ABAS */}

        <section className={styles.tabsSection}>
          <AgendamentoTabs
            tabAtiva={tabAtiva}
            onTabChange={setTabAtiva}
          />
        </section>


        {/* CARDS */}

        <section className={styles.cardsArea}>

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

          {filtrados.map((agendamento) => (
            <AgendamentoCard
              key={agendamento.id}
              quadra={agendamento.quadra}
              data={agendamento.data}
              horario={agendamento.horario}
              onCancelar={() =>
                cancelar(agendamento.id)
              }
            />
          ))}

        </section>

      </main>

    </div>
  );
}

export default Agendamentos;
