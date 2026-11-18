import { useEffect, useState } from "react";
import { requisicaoApi } from "../services/api.js";
import { PERIODOS, horarioFim } from "../mockup/horarios.js";

const TODOS_OS_HORARIOS = PERIODOS.flatMap((periodo) => periodo.horarios);

function hojeISO() {
  return new Date().toLocaleDateString("sv-SE");
}

// Busca no backend os horários já reservados de uma quadra em uma data
// ("AAAA-MM-DD") e devolve { ocupados: Set<"HH:MM">, carregando, erro }.
// Também bloqueia os horários de hoje que já passaram.
// "ignorar" = { data, horaInicio } da própria reserva, ao remarcar.
export default function useHorariosOcupados(idQuadra, data, ignorar) {
  const chave = idQuadra && data ? `${idQuadra}|${data}` : null;
  const [resultado, setResultado] = useState({ chave: null, intervalos: [] });

  useEffect(() => {
    if (!chave) return;

    let ativo = true;
    const [id_qd, dt_agend] = chave.split("|");

    requisicaoApi(`/agendamentos/ocupados?id_qd=${id_qd}&dt_agend=${dt_agend}`)
      .then((resposta) => {
        if (ativo) setResultado({ chave, intervalos: resposta.dados, erro: "" });
      })
      .catch((error) => {
        if (ativo) setResultado({ chave, intervalos: [], erro: error.message });
      });

    return () => {
      ativo = false;
    };
  }, [chave]);

  const atualizado = chave && resultado.chave === chave;
  const intervalos = (atualizado ? resultado.intervalos : []).filter(
    (item) => !(ignorar && ignorar.data === data && ignorar.horaInicio === item.inicio),
  );

  const agora = new Date().toTimeString().slice(0, 5);
  const ocupados = new Set(
    TODOS_OS_HORARIOS.filter(
      (horario) =>
        (data === hojeISO() && horario <= agora) ||
        intervalos.some(
          (item) => item.inicio < horarioFim(horario) && item.fim > horario,
        ),
    ),
  );

  return {
    ocupados,
    carregando: Boolean(chave) && !atualizado,
    erro: atualizado ? resultado.erro : "",
  };
}
