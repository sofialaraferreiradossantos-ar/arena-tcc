// Aceita apenas datas reais no formato YYYY-MM-DD (ex.: 2026-02-30 é recusado).
function validarData(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data ?? ""))) return false;

    const [ano, mes, dia] = data.split("-").map(Number);
    const objeto = new Date(Date.UTC(ano, mes - 1, dia));

    return (
        objeto.getUTCFullYear() === ano &&
        objeto.getUTCMonth() === mes - 1 &&
        objeto.getUTCDate() === dia
    );
}

module.exports = validarData;
