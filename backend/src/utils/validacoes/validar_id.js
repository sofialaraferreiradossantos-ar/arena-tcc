// Um id válido é um número inteiro maior que zero (aceita "3" ou 3).
function validarId(id) {
    return /^[1-9]\d*$/.test(String(id ?? ""));
}

module.exports = validarId;
