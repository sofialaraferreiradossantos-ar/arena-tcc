import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";
import { periodosDoDia } from "../../mockup/horarios.js";
import { dataISO, formatarData } from "../../mockup/agendamentos.js";
import useHorariosOcupados from "../../hooks/useHorariosOcupados.js";

// Janela para REMARCAR uma reserva já paga. A quadra continua a mesma
// (o valor pago não muda); só a data e o horário podem ser trocados.
// Os horários ocupados vêm do banco de dados.
function AgendamentoForm({ agendamento, onSalvar, onFechar }) {
  const hoje = dataISO(new Date());

  const [data, setData] = useState(agendamento.data);
  const [horario, setHorario] = useState(agendamento.horaInicio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const { ocupados, carregando, erro: erroHorarios } = useHorariosOcupados(
    agendamento.quadra.id,
    data,
    agendamento,
  );

  useEffect(() => {
    const fecharComEsc = (event) => event.key === "Escape" && onFechar();
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  const dataValida = data && data >= hoje;
  // Horários do dia escolhido (no fim de semana fecha às 18h)
  const periodos = dataValida ? periodosDoDia(data) : [];
  const horarioNoDia = periodos.some((periodo) =>
    periodo.horarios.includes(horario),
  );
  const horarioValido = horario && horarioNoDia && !ocupados.has(horario);
  const semMudancas =
    agendamento.data === data && agendamento.horaInicio === horario;
  const podeSalvar =
    dataValida && horarioValido && !semMudancas && !carregando && !salvando;

  async function salvar(event) {
    event.preventDefault();
    if (!podeSalvar) return;

    setSalvando(true);
    setErro("");

    try {
      await onSalvar({ dt_agend: data, hora_inicio: horario });
    } catch (error) {
      setErro(error.message);
      setSalvando(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onFechar}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-agendamento"
        onClick={(event) => event.stopPropagation()}
        onSubmit={salvar}
      >
        <div className={styles.modalHeader}>
          <h2 id="titulo-agendamento">Remarcar agendamento</h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onFechar}
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        <p className={styles.modalAtual}>
          Atual: {agendamento.quadra.nome} • {formatarData(agendamento.data)} •{" "}
          {agendamento.horaInicio}
        </p>

        <label className={styles.campo}>
          Data
          <input
            type="date"
            value={data}
            min={hoje}
            onChange={(event) => setData(event.target.value)}
            autoFocus
            required
          />
        </label>

        <div className={styles.campo}>
          <span>Horário</span>
          {!dataValida ? (
            <p className={styles.modalDica}>
              Escolha uma data a partir de hoje para ver os horários.
            </p>
          ) : carregando ? (
            <p className={styles.modalDica}>Carregando horários...</p>
          ) : erroHorarios ? (
            <p className={styles.modalDica} role="alert">
              {erroHorarios}
            </p>
          ) : (
            periodos.map((periodo) => (
              <div key={periodo.label} className={styles.periodo}>
                <small>{periodo.label}</small>
                <div className={styles.horarios}>
                  {periodo.horarios.map((item) => {
                    const ocupado = ocupados.has(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={ocupado}
                        aria-pressed={horario === item}
                        title={ocupado ? "Horário ocupado" : undefined}
                        className={`${styles.horarioBtn} ${
                          horario === item && !ocupado
                            ? styles.horarioActive
                            : ""
                        }`}
                        onClick={() => setHorario(item)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {erro && (
          <p className={styles.erroForm} role="alert">
            {erro}
          </p>
        )}

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.fecharEdicao}
            onClick={onFechar}
          >
            Voltar
          </button>
          <button
            type="submit"
            className={styles.confirmarEdicao}
            disabled={!podeSalvar}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgendamentoForm;
