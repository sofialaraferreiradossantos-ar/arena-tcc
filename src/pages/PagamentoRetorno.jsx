import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "../styles/home.module.css";
import { requisicaoApi } from "../services/api.js";

// Pix pode levar alguns instantes para ser confirmado: consulta de novo
// a cada 4 segundos, por até 5 minutos.
const INTERVALO_CONSULTA = 4000;
const MAXIMO_CONSULTAS = 75;

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

const TEXTOS = {
  pago: {
    etiqueta: "PAGAMENTO APROVADO",
    titulo: "Reserva confirmada!",
    texto: "Recebemos o seu pagamento. Bom jogo!",
  },
  pendente: {
    etiqueta: "AGUARDANDO PAGAMENTO",
    titulo: "Confirmando o pagamento...",
    texto:
      "Se você pagou com Pix, a confirmação pode levar alguns instantes. Esta página atualiza sozinha.",
  },
  cancelado: {
    etiqueta: "PAGAMENTO NÃO CONCLUÍDO",
    titulo: "A reserva foi cancelada",
    texto:
      "O pagamento não foi concluído e o horário foi liberado. Nenhum valor foi cobrado.",
  },
  estornado: {
    etiqueta: "PAGAMENTO ESTORNADO",
    titulo: "O valor foi devolvido",
    texto: "Este pagamento foi estornado pela arena.",
  },
};

export default function PagamentoRetorno() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const cancelado = params.get("cancelado") === "1";

  const token = localStorage.getItem("token_sessao");
  const erroInicial = !sessionId
    ? "Sessão de pagamento não informada."
    : !token
      ? "Entre na sua conta para ver a situação do pagamento."
      : "";

  const [pagamento, setPagamento] = useState(null);
  const [erroConsulta, setErro] = useState("");
  const erro = erroInicial || erroConsulta;

  useEffect(() => {
    if (!sessionId || !token) return;

    let ativo = true;
    let consultas = 0;
    let temporizador;

    const consultar = async (desistir) => {
      try {
        const caminho = `/pagamentos/stripe/sessao/${encodeURIComponent(sessionId)}`;
        const resultado = await requisicaoApi(
          desistir ? `${caminho}/cancelar` : caminho,
          { method: desistir ? "POST" : "GET", autenticado: true },
        );

        if (!ativo) return;
        setPagamento(resultado.dados);

        consultas += 1;
        if (
          resultado.dados.status_pag === "pendente" &&
          consultas < MAXIMO_CONSULTAS
        ) {
          temporizador = setTimeout(() => consultar(false), INTERVALO_CONSULTA);
        }
      } catch (error) {
        if (ativo) setErro(error.message);
      }
    };

    // Voltou pelo botão "voltar" do Stripe: encerra a sessão e libera o horário
    consultar(cancelado);

    return () => {
      ativo = false;
      clearTimeout(temporizador);
    };
  }, [sessionId, cancelado, token]);

  const textos = TEXTOS[pagamento?.status_pag] || TEXTOS.pendente;
  const agendamento = pagamento?.agendamento;

  return (
    <div className={styles.container}>
      <main className={`${styles.app} ${styles.paymentPage}`}>
        {erro ? (
          <>
            <header className={styles.paymentHeading}>
              <span>PAGAMENTO</span>
              <h1>Não foi possível verificar</h1>
            </header>
            <p className={styles.pagamentoErro} role="alert">
              {erro}{" "}
              {!token && <Link to="/login">Fazer login</Link>}
            </p>
          </>
        ) : !pagamento ? (
          <header className={styles.paymentHeading}>
            <span>PAGAMENTO</span>
            <h1>Verificando pagamento...</h1>
          </header>
        ) : (
          <>
            <header className={styles.paymentHeading}>
              <span>{textos.etiqueta}</span>
              <h1>{textos.titulo}</h1>
              <p>{textos.texto}</p>
            </header>

            <div className={`${styles.quadraCard} ${styles.pagamentoCard}`}>
              <div className={styles.pixArea}>
                <div>
                  <h4>Resumo do agendamento</h4>
                  <p>{agendamento.quadra}</p>
                  <p>{formatarData(agendamento.data)}</p>
                  <p>
                    {agendamento.horaInicio} - {agendamento.horaFim}
                  </p>
                </div>

                <div className={styles.valorArea}>
                  <h3>Valor:</h3>
                  <p>R$ {pagamento.valor_pag.replace(".", ",")}</p>
                  {pagamento.status_pag === "pago" && (
                    <small>Pago via {pagamento.forma_pag}</small>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          to={
            pagamento?.status_pag === "pago" ? "/agendamentos" : "/agendar-horario"
          }
          className={`${styles.activeBtn} ${styles.confirmarPagamento} ${styles.pagamentoLink}`}
        >
          {pagamento?.status_pag === "pago"
            ? "Ver meus agendamentos"
            : "Escolher outro horário"}
        </Link>
      </main>
    </div>
  );
}
