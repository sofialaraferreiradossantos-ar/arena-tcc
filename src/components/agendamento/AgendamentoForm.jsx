import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import styles from "../../styles/agendamentos.module.css";
import { modalidades, quadrasMckp, temModalidade } from "../../mockup/dados.js";
import { HORARIOS_OCUPADOS, PERIODOS } from "../../mockup/horarios.js";
import { dataISO, formatarData } from "../../mockup/agendamentos.js";

const quadrasDisponiveis = quadrasMckp.filter((quadra) => quadra.available);

// Janela para adicionar (agendamento = null) ou editar um agendamento.
// Só lista quadras disponíveis e bloqueia horários já ocupados na mesma
// quadra e data, inclusive pelos outros agendamentos do cliente.
function AgendamentoForm({ agendamento, agendamentos, onSalvar, onFechar }) {
  const editando = Boolean(agendamento);
  const hoje = dataISO(new Date());

  const quadraAtualDisponivel = quadrasDisponiveis.some(
    (quadra) => quadra.id === agendamento?.quadraId,
  );
  const [quadraId, setQuadraId] = useState(
    quadraAtualDisponivel ? String(agendamento.quadraId) : "",
  );
  const [data, setData] = useState(agendamento?.data ?? "");
  const [horario, setHorario] = useState(agendamento?.horario ?? "");

  useEffect(() => {
    const fecharComEsc = (event) => event.key === "Escape" && onFechar();
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  const ocupados = new Set([
    ...HORARIOS_OCUPADOS,
    ...agendamentos
      .filter(
        (item) =>
          item.id !== agendamento?.id &&
          String(item.quadraId) === quadraId &&
          item.data === data,
      )
      .map((item) => item.horario),
  ]);

  const dataValida = data && data >= hoje;
  const horarioValido = horario && !ocupados.has(horario);
  const semMudancas =
    editando &&
    String(agendamento.quadraId) === quadraId &&
    agendamento.data === data &&
    agendamento.horario === horario;
  const podeSalvar = quadraId && dataValida && horarioValido && !semMudancas;

  const quadraAtual = quadrasMckp.find(
    (quadra) => quadra.id === agendamento?.quadraId,
  );

  function salvar(event) {
    event.preventDefault();
    if (!podeSalvar) return;
    onSalvar({ quadraId: Number(quadraId), data, horario });
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
          <h2 id="titulo-agendamento">
            {editando ? "Editar agendamento" : "Novo agendamento"}
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onFechar}
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        {editando && (
          <p className={styles.modalAtual}>
            Atual: {quadraAtual?.title ?? "Quadra"} •{" "}
            {formatarData(agendamento.data)} • {agendamento.horario}
            {!quadraAtualDisponivel && " (quadra indisponível, escolha outra)"}
          </p>
        )}

        <label className={styles.campo}>
          Quadra
          <select
            value={quadraId}
            onChange={(event) => setQuadraId(event.target.value)}
            autoFocus
            required
          >
            <option value="">Selecione uma quadra disponível</option>
            {modalidades.map((modalidade) => (
              <optgroup key={modalidade.id} label={modalidade.label}>
                {quadrasDisponiveis
                  .filter((quadra) => temModalidade(quadra, modalidade.id))
                  .map((quadra) => (
                    <option key={quadra.id} value={quadra.id}>
                      {quadra.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className={styles.campo}>
          Data
          <input
            type="date"
            value={data}
            min={hoje}
            onChange={(event) => setData(event.target.value)}
            required
          />
        </label>

        <div className={styles.campo}>
          <span>Horário</span>
          {!quadraId || !dataValida ? (
            <p className={styles.modalDica}>
              Escolha a quadra e uma data a partir de hoje para ver os horários.
            </p>
          ) : (
            PERIODOS.map((periodo) => (
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
            {editando ? "Salvar alterações" : "Adicionar agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgendamentoForm;
