const db = require("../database/Connection");
const { validarData, validarHora } = require("./validacoes");

// Uma reserva dura 1 hora. Funcionamento: seg-sex 08h-22h, sáb/dom 08h-18h.
const HORA_ABERTURA = "08:00:00";
const ULTIMO_INICIO_SEMANA = "21:00:00";
const ULTIMO_INICIO_FIM_DE_SEMANA = "17:00:00";

// "09:00" -> "09:00:00", para comparar horários como texto
function normalizarHora(hora) {
    return String(hora).length === 5 ? `${hora}:00` : String(hora);
}

function somarUmaHora(hora) {
    const [h, m, s] = hora.split(":");
    return `${String(Number(h) + 1).padStart(2, "0")}:${m}:${s}`;
}

// A data/hora ("AAAA-MM-DD", "HH:MM:SS") ainda não chegou?
function estaNoFuturo(dt_agend, hora) {
    const agora = new Date();
    const hoje = agora.toLocaleDateString("sv-SE");
    const horaAgora = agora.toTimeString().slice(0, 8);
    return dt_agend > hoje || (dt_agend === hoje && normalizarHora(hora) > horaAgora);
}

// Valida uma reserva de 1 hora feita pelo cliente.
// Devolve { erro } ou { inicio, fim } no formato HH:MM:SS.
function validarReservaCliente(dt_agend, hora_inicio) {
    if (!validarData(dt_agend) || !validarHora(hora_inicio)) {
        return { erro: "Data (AAAA-MM-DD) ou horário (HH:MM) inválidos." };
    }

    const inicio = normalizarHora(hora_inicio);
    const fimDeSemana = [0, 6].includes(new Date(`${dt_agend}T00:00:00`).getDay());
    const ultimoInicio = fimDeSemana ? ULTIMO_INICIO_FIM_DE_SEMANA : ULTIMO_INICIO_SEMANA;

    if (!inicio.endsWith(":00:00") || inicio < HORA_ABERTURA || inicio > ultimoInicio) {
        return { erro: "Horário fora do funcionamento da arena." };
    }

    if (!estaNoFuturo(dt_agend, inicio)) {
        return { erro: "Não é possível agendar um horário que já passou." };
    }

    return { inicio, fim: somarUmaHora(inicio) };
}

// Existe outro agendamento ativo na mesma quadra e data com horário sobreposto?
// Aceita uma conexão para rodar dentro de uma transação.
async function existeConflito(id_qd, dt_agend, hora_inicio, hora_fim, ignorarId = 0, conexao = db) {
    const [rows] = await conexao.query(
        `
            SELECT id_agend
            FROM agendamentos
            WHERE id_qd = ?
              AND dt_agend = ?
              AND status_agend <> 'cancelado'
              AND id_agend <> ?
              AND hora_inicio < ?
              AND hora_fim > ?;
        `,
        [id_qd, dt_agend, ignorarId, hora_fim, hora_inicio]
    );
    return rows.length > 0;
}

module.exports = {
    normalizarHora,
    somarUmaHora,
    estaNoFuturo,
    validarReservaCliente,
    existeConflito
};
