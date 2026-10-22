// Horários de reserva (1 hora cada), compartilhados entre o agendamento e a
// edição de agendamentos.
export const PERIODOS = [
  { label: "Manhã", horarios: ["08:00", "09:00", "10:00", "11:00"] },
  { label: "Tarde", horarios: ["13:00", "14:00", "15:00", "16:00", "17:00"] },
  { label: "Noite", horarios: ["18:00", "19:00", "20:00"] },
];

// Simula horários já ocupados vindos do backend (por enquanto fixo)
export const HORARIOS_OCUPADOS = ["10:00", "15:00"];

export function horarioFim(inicio) {
  const hora = Number(inicio.slice(0, 2)) + 1;
  return `${String(hora).padStart(2, "0")}:00`;
}
