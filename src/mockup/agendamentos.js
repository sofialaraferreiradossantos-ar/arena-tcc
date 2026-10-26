import { quadrasMckp } from "./dados.js";

// Agendamentos de exemplo do cliente. Ficam salvos no navegador para que
// novos agendamentos e edições não se percam ao trocar de página.
const STORAGE_KEY = "arena-agendamentos";

export function dataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function diasAPartirDeHoje(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return dataISO(data);
}

const agendamentosIniciais = [
  { id: 1, quadraId: 1, data: diasAPartirDeHoje(-10), horario: "18:00" },
  { id: 2, quadraId: 2, data: diasAPartirDeHoje(3), horario: "20:00" },
  { id: 3, quadraId: 1, data: diasAPartirDeHoje(5), horario: "19:00" },
];

export function carregarAgendamentos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Ignora agendamentos de quadras que foram removidas do site.
    if (Array.isArray(salvos))
      return salvos.filter((item) =>
        quadrasMckp.some((quadra) => quadra.id === item.quadraId),
      );
  } catch {
    // Sem acesso ao armazenamento: usa os dados de exemplo.
  }
  return agendamentosIniciais;
}

export function salvarAgendamentos(agendamentos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
  } catch {
    // Sem acesso ao armazenamento: as mudanças valem só nesta visita.
  }
}
