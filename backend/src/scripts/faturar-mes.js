// =====================================================
// FECHAMENTO DO MÊS - gera e envia as faturas de todos os clientes
// que têm reservas sem pagamento no mês.
//
// Uso (dentro da pasta backend):
//   npm run faturar              -> fatura o mês anterior
//   npm run faturar -- 2026-11   -> fatura um mês específico
//
// Pode ser agendado no Agendador de Tarefas do Windows (ou cron)
// para rodar todo dia 1º. Rodar duas vezes não duplica as faturas:
// reservas já faturadas não entram de novo.
// =====================================================

const path = require("path");
require("dotenv").config({
    path: [path.join(__dirname, "../../.env.local"), path.join(__dirname, "../../.env")],
    quiet: true
});

const db = require("../database/Connection");
const { gerarFatura, listarClientesAFaturar, mesAnterior } = require("../controllers/faturas");

async function main() {
    const mes = process.argv[2] || mesAnterior();

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
        console.error("Mês inválido. Use AAAA-MM, por exemplo: npm run faturar -- 2026-11");
        process.exitCode = 1;
        return;
    }

    const clientes = await listarClientesAFaturar(mes);

    if (clientes.length === 0) {
        console.log(`Nenhuma reserva a faturar em ${mes}.`);
        return;
    }

    console.log(`Faturando ${clientes.length} cliente(s) em ${mes}...\n`);

    let falhas = 0;

    for (const cliente of clientes) {
        try {
            const fatura = await gerarFatura(cliente.id_usu, mes);
            if (!fatura) continue;
            console.log(`OK    ${cliente.nome} - R$ ${fatura.valor} (${fatura.reservas.length} reserva(s)) ${fatura.link}`);
        } catch (error) {
            falhas++;
            console.error(`ERRO  ${cliente.nome}: ${error.message}`);
        }
    }

    if (falhas > 0) {
        console.error(`\n${falhas} fatura(s) não foram geradas. Rode o comando de novo para tentar outra vez.`);
        process.exitCode = 1;
    }
}

main()
    .catch((error) => {
        console.error("Erro no fechamento do mês:", error.message);
        process.exitCode = 1;
    })
    .finally(() => db.end());
