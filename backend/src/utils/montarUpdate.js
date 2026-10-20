// Update dinâmico: monta o "SET campo = ?" só com os campos que vieram no body.
// camposValidos mapeia o nome recebido no body -> nome da coluna no banco.
// Ex.: body { nome_qd: "A" } -> setClauses ["nome_qd = ?"], values ["A"].
function montarUpdate(dados, camposValidos) {
    const setClauses = [];
    const values = [];

    for (const key in dados || {}) {
        if (Object.hasOwn(camposValidos, key) && dados[key] !== undefined) {
            setClauses.push(`${camposValidos[key]} = ?`);
            values.push(dados[key]);
        }
    }

    return { setClauses, values };
}

module.exports = montarUpdate;
