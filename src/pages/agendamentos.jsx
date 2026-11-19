import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";

import styles from "../styles/agendamentos.module.css";

import HeaderAgendamentos from "../components/agendamento/HeaderAgendamentos";
import AgendamentoTabs from "../components/agendamento/AgendamentoTabs";
import AgendamentoCard from "../components/agendamento/Agendamentocard";
import AgendamentoForm from "../components/agendamento/AgendamentoForm";

import { dataISO, formatarData } from "../mockup/agendamentos.js";
import { requisicaoApi } from "../services/api.js";

const STATUS = {
  confirmado: { texto: "Pago e confirmado", tipo: "confirmado" },
  pendente: { texto: "Aguardando pagamento", tipo: "pendente" },
};

function Agendamentos() {
  const navigate = useNavigate();
  const logado = Boolean(localStorage.getItem("token_sessao"));

  const [tabAtiva, setTabAtiva] = useState("proximo");
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(logado);
  const [erro, setErro] = useState("");
  const [precisaLogin, setPrecisaLogin] = useState(!logado);

  // null = fechado, objeto = remarcar esse agendamento.
  const [remarcando, setRemarcando] = useState(null);
  const [aviso, setAviso] = useState("");

  // As reservas vêm do banco (GET /agendamentos/meus)
  const carregar = useCallback(() => {
    return requisicaoApi("/agendamentos/meus", { autenticado: true })
      .then((resultado) => {
        setAgendamentos(resultado.dados);
        setErro("");
      })
      .catch((error) => {
        setErro(error.message);
        if (error.precisaLogin) setPrecisaLogin(true);
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (logado) carregar();
  }, [logado, carregar]);

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(""), 5000);
    return () => clearTimeout(timer);
  }, [aviso]);

  // Próximos = de hoje em diante; anteriores = datas que já passaram.
  const hoje = dataISO(new Date());
  const agora = new Date().toTimeString().slice(0, 5);
  const aindaVai = (agendamento) =>
    agendamento.data > hoje ||
    (agendamento.data === hoje && agendamento.horaInicio > agora);

  const filtrados = agendamentos.filter((agendamento) =>
    tabAtiva === "proximo" ? agendamento.data >= hoje : agendamento.data < hoje,
  );

  // Administrador vê todas as reservas (com quem fez) no painel
  if (localStorage.getItem("token_admin")) {
    return <Navigate to="/administrador/agendamentos" replace />;
  }

  async function cancelar(agendamento) {
    const pago = agendamento.status === "confirmado";
    const confirmou = window.confirm(
      pago
        ? "Cancelar esta reserva? O valor pago será estornado."
        : "Cancelar esta reserva? O pagamento em aberto será encerrado.",
    );
    if (!confirmou) return;

    try {
      const resultado = await requisicaoApi(
        `/agendamentos/meus/${agendamento.id}`,
        { method: "DELETE", autenticado: true },
      );
      setAviso(resultado.mensagem);
    } catch (error) {
      setErro(error.message);
    }

    carregar();
  }

  async function remarcar(dados) {
    // Erros sobem para o formulário, que mostra a mensagem
    const resultado = await requisicaoApi(
      `/agendamentos/meus/${remarcando.id}`,
      { method: "PATCH", body: dados, autenticado: true },
    );

    setAviso(resultado.mensagem);
    setRemarcando(null);
    setTabAtiva("proximo");
    carregar();
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
            onClick={() => navigate("/agendar-horario")}
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

        {erro && (
          <p className={styles.erroForm} role="alert">
            {erro} {precisaLogin && <Link to="/login">Fazer login</Link>}
          </p>
        )}

        {/* CARDS */}

        <section className={styles.cardsArea}>
          {precisaLogin && !erro && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <FaRegCalendarAlt />
              </div>

              <h2>Entre na sua conta</h2>

              <p>
                <Link to="/login">Faça login</Link> para ver suas reservas.
              </p>
            </div>
          )}

          {!precisaLogin && carregando && (
            <div className={styles.empty}>
              <p>Carregando agendamentos...</p>
            </div>
          )}

          {!precisaLogin && !carregando && !erro && filtrados.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <FaRegCalendarAlt />
              </div>

              <h2>Nenhum agendamento encontrado</h2>

              <p>Você não possui agendamentos nesta categoria.</p>
            </div>
          )}

          {filtrados.map((agendamento) => {
            const futuro = aindaVai(agendamento);

            return (
              <AgendamentoCard
                key={agendamento.id}
                quadra={agendamento.quadra.nome}
                data={formatarData(agendamento.data)}
                horario={`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                status={STATUS[agendamento.status]}
                onCancelar={futuro ? () => cancelar(agendamento) : undefined}
                onEditar={
                  futuro && agendamento.status === "confirmado"
                    ? () => setRemarcando(agendamento)
                    : undefined
                }
              />
            );
          })}
        </section>
      </main>

      {remarcando && (
        <AgendamentoForm
          agendamento={remarcando}
          onSalvar={remarcar}
          onFechar={() => setRemarcando(null)}
        />
      )}
    </div>
  );
}

export default Agendamentos;
