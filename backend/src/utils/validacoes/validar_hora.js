// Aceita HH:MM ou HH:MM:SS, de 00:00 a 23:59.
function validarHora(hora) {
    return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(hora ?? ""));
}

module.exports = validarHora;
