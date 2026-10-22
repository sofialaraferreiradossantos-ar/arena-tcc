import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import styles from "../styles/agendamentos.module.css";

import HeaderAgendamentos from "../components/agendamento/HeaderAgendamentos";
import AgendamentoTabs from "../components/agendamento/AgendamentoTabs";
import AgendamentoCard from "../components/agendamento/Agendamentocard";
import AgendamentoForm from "../components/agendamento/AgendamentoForm";

import { quadrasMckp } from "../mockup/dados.js";
import { horarioFim } from "../mockup/horarios.js";
import {
  carregarAgendamentos,
  dataISO,
  formatarData,
  salvarAgendamentos,
} from "../mockup/agendamentos.js";

const nomeDaQuadra = (quadraId) =>
  quadrasMckp.find((quadra) => quadra.id === quadraId)?.title ?? "Quadra";

function Agendamentos() {
  const [tabAtiva, setTabAtiva] = useState("anterior");

  const [agendamentos, setAgendamentos] = useState(carregarAgendamentos);

  // null = fechado, "novo" = adicionar, objeto = editar esse agendamento.
  const [formulario, setFormulario] = useState(null);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    salvarAgendamentos(agendamentos);
  }, [agendamentos]);

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(""), 3500);
    return () => clearTimeout(timer);
  }, [aviso]);

  // Próximos = de hoje em diante; anteriores = datas que já passaram.
  const hoje = dataISO(new Date());
  const filtrados = agendamentos
    .filter((agendamento) =>
      tabAtiva === "proximo"
        ? agendamento.data >= hoje
        : agendamento.data < hoje,
    )
    .sort((a, b) =>
      `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`),
    );

  function cancelar(id) {
    setAgendamentos((agendamentosAtuais) =>
      agendamentosAtuais.filter((agendamento) => agendamento.id !== id),
    );
  }

  function salvar(dados) {
    if (formulario === "novo") {
      setAgendamentos((agendamentosAtuais) => [
        ...agendamentosAtuais,
        {
          id: Math.max(0, ...agendamentosAtuais.map((item) => item.id)) + 1,
          ...dados,
        },
      ]);
      setAviso("Agendamento adicionado com sucesso.");
    } else {
      setAgendamentos((agendamentosAtuais) =>
        agendamentosAtuais.map((agendamento) =>
          agendamento.id === formulario.id
            ? { ...agendamento, ...dados }
            : agendamento,
        ),
      );
      setAviso("Agendamento atualizado com sucesso.");
    }
    setTabAtiva("proximo");
    setFormulario(null);
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

            <p>Confira suas reservas e horários.</p>
          </div>
        </section>

        {/* ABAS + NOVO AGENDAMENTO */}

        <section className={styles.tabsComAcao}>
          <AgendamentoTabs tabAtiva={tabAtiva} onTabChange={setTabAtiva} />

          <button
            type="button"
            className={styles.addPrimaryButton}
            onClick={() => setFormulario("novo")}
          >
            <FaPlus />
            <span>Adicionar agendamento</span>
          </button>
        </section>

        {aviso && (
          <p className={styles.aviso} role="status">
            {aviso}
          </p>
        )}

        {/* CARDS */}

        <section className={styles.cardsArea}>
          {filtrados.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📅</div>

              <h2>Nenhum agendamento encontrado</h2>

              <p>Você não possui agendamentos nesta categoria.</p>
            </div>
          )}

          {filtrados.map((agendamento) => (
            <AgendamentoCard
              key={agendamento.id}
              quadra={nomeDaQuadra(agendamento.quadraId)}
              data={formatarData(agendamento.data)}
              horario={`${agendamento.horario} - ${horarioFim(agendamento.horario)}`}
              onCancelar={() => cancelar(agendamento.id)}
              onEditar={
                agendamento.data >= hoje
                  ? () => setFormulario(agendamento)
                  : undefined
              }
            />
          ))}
        </section>
      </main>

      {formulario && (
        <AgendamentoForm
          agendamento={formulario === "novo" ? null : formulario}
          agendamentos={agendamentos}
          onSalvar={salvar}
          onFechar={() => setFormulario(null)}
        />
      )}
    </div>
  );
}

export default Agendamentos;
