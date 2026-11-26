import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/home.module.css";
import { horarioFim } from "../mockup/horarios.js";
import { requisicaoApi } from "../services/api.js";
import { pagarInscricao } from "../services/torneios.js";

function formatarValor(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "—";
  return `R$ ${numero.toFixed(2).replace(".", ",")}`;
}

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Pagamento() {
  const location = useLocation();
  const agendamento = location.state?.agendamento;
  const inscricao = location.state?.inscricao;

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [precisaLogin, setPrecisaLogin] = useState(false);

  // Cria a sessão no backend e leva o cliente para a página segura do Stripe.
  // Nenhum dado de cartão passa por aqui.
  const pagarComStripe = async () => {
    const token = localStorage.getItem("token_sessao");

    if (!token) {
      setPrecisaLogin(true);
      setErro("Entre na sua conta para pagar a reserva.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resultado = await requisicaoApi("/pagamentos/stripe/checkout", {
        method: "POST",
        autenticado: true,
        body: {
          id_qd: agendamento.quadraId,
          dt_agend: agendamento.data,
          hora_inicio: agendamento.horario,
        },
      });

      window.location.assign(resultado.dados.url);
    } catch (error) {
      if (error.precisaLogin) setPrecisaLogin(true);
      setErro(error.message);
      setCarregando(false);
    }
  };

  // Inscrição em torneio: a participação foi gravada como "pendente" e é
  // paga aqui pelo Stripe; o pagamento aprovado confirma a participação.
  const pagarInscricaoComStripe = async () => {
    if (!localStorage.getItem("token_sessao")) {
      setPrecisaLogin(true);
      setErro("Entre na sua conta para pagar a inscrição.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      window.location.assign(await pagarInscricao(inscricao.id_part));
    } catch (error) {
      if (error.precisaLogin) setPrecisaLogin(true);
      setErro(error.message);
      setCarregando(false);
    }
  };

  if (!agendamento && inscricao) {
    const confirmada = inscricao.status === "confirmado";

    return (
      <div className={styles.container}>
        <main className={`${styles.app} ${styles.paymentPage}`}>
          <header className={styles.paymentHeading}>
            <span>{confirmada ? "INSCRIÇÃO CONFIRMADA" : "PAGAMENTO DA INSCRIÇÃO"}</span>
            <h1>{confirmada ? "Inscrição confirmada!" : "Pagamento seguro"}</h1>
            <p>
              {confirmada
                ? "Este torneio não cobra inscrição. Sua vaga já está garantida."
                : "Você será levado ao ambiente seguro do Stripe para pagar com cartão ou Pix. Os dados do seu cartão não passam pelos nossos servidores."}
            </p>
          </header>

          <div className={`${styles.quadraCard} ${styles.pagamentoCard}`}>
            <div className={styles.pixArea}>
              <div>
                <h4>Resumo da inscrição</h4>
                <p>{inscricao.torneio}</p>
                <p>Equipe {inscricao.equipe}</p>
                <p>{inscricao.data}</p>
              </div>

              <div className={styles.valorArea}>
                <h3>Valor Total:</h3>
                <p>{confirmada ? "Gratuito" : formatarValor(inscricao.valor)}</p>
              </div>
            </div>
          </div>

          {!confirmada && (
            <p className={styles.pagamentoAviso}>
              🔒 Aceitamos cartão de crédito/débito e Pix. Você tem 30 minutos
              para concluir o pagamento; depois disso a vaga na equipe é
              liberada.
            </p>
          )}

          {erro && (
            <p className={styles.pagamentoErro} role="alert">
              {erro}{" "}
              {precisaLogin && <Link to="/login">Fazer login</Link>}
            </p>
          )}

          {confirmada ? (
            <Link
              to="/torneios"
              className={`${styles.activeBtn} ${styles.confirmarPagamento} ${styles.pagamentoLink}`}
            >
              Voltar aos torneios
            </Link>
          ) : (
            <button
              type="button"
              className={`${styles.activeBtn} ${styles.confirmarPagamento}`}
              onClick={pagarInscricaoComStripe}
              disabled={carregando}
            >
              {carregando ? "Abrindo pagamento seguro..." : "Pagar com Stripe"}
            </button>
          )}
        </main>
      </div>
    );
  }

  if (!agendamento) {
    return (
      <div className={styles.container}>
        <main className={`${styles.app} ${styles.paymentPage}`}>
          <header className={styles.paymentHeading}>
            <span>PAGAMENTO</span>
            <h1>Nenhuma reserva selecionada</h1>
            <p>Escolha a quadra, a data e o horário antes de pagar.</p>
          </header>

          <Link
            to="/agendar-horario"
            className={`${styles.activeBtn} ${styles.confirmarPagamento} ${styles.pagamentoLink}`}
          >
            Agendar horário
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={`${styles.app} ${styles.paymentPage}`}>
        <header className={styles.paymentHeading}>
          <span>FINALIZE SUA RESERVA</span>
          <h1>Pagamento seguro</h1>
          <p>
            Você será levado ao ambiente seguro do Stripe para pagar com
            cartão ou Pix. Os dados do seu cartão não passam pelos nossos
            servidores.
          </p>
        </header>

        <div className={`${styles.quadraCard} ${styles.pagamentoCard}`}>
          <div className={styles.pixArea}>
            <div>
              <h4>Resumo do agendamento</h4>
              <p>
                {agendamento.quadra} • {agendamento.numeroQuadra}
              </p>
              <p>{formatarData(agendamento.data)}</p>
              <p>
                {agendamento.horario} - {horarioFim(agendamento.horario)}
              </p>
            </div>

            <div className={styles.valorArea}>
              <h3>Valor Total:</h3>
              <p>{formatarValor(agendamento.valor)}</p>
            </div>
          </div>
        </div>

        <p className={styles.pagamentoAviso}>
          🔒 Aceitamos cartão de crédito/débito e Pix. Você tem 30 minutos para
          concluir o pagamento; depois disso o horário é liberado.
        </p>

        {erro && (
          <p className={styles.pagamentoErro} role="alert">
            {erro}{" "}
            {precisaLogin && <Link to="/login">Fazer login</Link>}
          </p>
        )}

        <button
          type="button"
          className={`${styles.activeBtn} ${styles.confirmarPagamento}`}
          onClick={pagarComStripe}
          disabled={carregando}
        >
          {carregando ? "Abrindo pagamento seguro..." : "Pagar com Stripe"}
        </button>
      </main>
    </div>
  );
}
