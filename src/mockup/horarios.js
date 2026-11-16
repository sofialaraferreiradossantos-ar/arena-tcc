// Horários de reserva (1 hora cada), compartilhados entre o agendamento e a
// edição de agendamentos.
// Funcionamento (igual à página Sobre):
// segunda a sexta 08h às 22h, sábado e domingo 08h às 18h.
export const PERIODOS = [
  { label: "Manhã", horarios: ["08:00", "09:00", "10:00", "11:00"] },
  { label: "Tarde", horarios: ["13:00", "14:00", "15:00", "16:00", "17:00"] },
  { label: "Noite", horarios: ["18:00", "19:00", "20:00", "21:00"] },
];

// No fim de semana o último horário começa às 17h (termina às 18h).
const FECHA_FIM_DE_SEMANA = "18:00";

// Devolve os períodos do dia escolhido. A data pode ser um Date ou
// um texto "AAAA-MM-DD" (o valor do <input type="date">).
export function periodosDoDia(data) {
  const dia =
    typeof data === "string" ? new Date(`${data}T00:00:00`) : new Date(data);
  const fimDeSemana = dia.getDay() === 0 || dia.getDay() === 6;
  if (!fimDeSemana) return PERIODOS;

  return PERIODOS.map((periodo) => ({
    ...periodo,
    horarios: periodo.horarios.filter((item) => item < FECHA_FIM_DE_SEMANA),
  })).filter((periodo) => periodo.horarios.length > 0);
}

// Simula horários já ocupados vindos do backend (por enquanto fixo)
export const HORARIOS_OCUPADOS = ["10:00", "15:00"];

export function horarioFim(inicio) {
  const hora = Number(inicio.slice(0, 2)) + 1;
  return `${String(hora).padStart(2, "0")}:00`;
}
