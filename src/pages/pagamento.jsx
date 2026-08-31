import { useState } from "react";
import styles from "../styles/home.module.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Pagamento() {
  const location = useLocation();
  const inscricao = location.state?.inscricao;

  // Valor vindo da inscrição do torneio (fallback: valor fixo antigo)
  const valorTotal = inscricao?.valor ?? 100;
  const valorFormatado = `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;

  const [metodo, setMetodo] = useState("pix");

  const [menuAberto, setMenuAberto] =
    useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.app}>

        {/* MENU LATERAL */}
        <div
          className={`${styles.sidebarMenu} ${
            menuAberto ? styles.open : ""
          }`}
        >
          {/* BOTÃO PARA FECHAR */}
          <button
            className={styles.closeMenu}
            onClick={() => setMenuAberto(false)}
          >
            ×
          </button>

          <a href="/home">
            🏠 Início
          </a>

          <a href="/quadra">
            🏐 Quadras
          </a>

          <a href="/agendar-horario">
            🕐 Agendar Horário
          </a>

          <a href="/agendamentos">
            📅 Agendamentos
          </a>

          <a href="/torneios">
            🏆 Torneios
          </a>

          <a href="/pagamento">
            💳 Pagamento
          </a>
        </div>

        <div className={styles.topHeader}>

          {/* O BOTÃO SÓ APARECE COM O MENU FECHADO */}
          {!menuAberto && (
            <div
              className={styles.menuIcon}
              onClick={() =>
                setMenuAberto(true)
              }
            >
              ☰
            </div>
          )}

          <div className={styles.logoArea}>
            <h2>
              <span>
                Pagamento
              </span>
            </h2>
          </div>

        </div>

        <div className={styles.pagamentoButtons}>

          <button
            className={
              metodo === "pix"
                ? `${styles.activeBtn} ${styles.pagamentoBtn}`
                : styles.pagamentoBtn
            }
            onClick={() =>
              setMetodo("pix")
            }
          >
            Pix
          </button>

          <button
            className={
              styles.pagamentoBtn
            }
            onClick={() => {
              setMetodo("cartao");

              navigate(
                "/pagamentoCartao"
              );
            }}
          >
            Cartão
          </button>

        </div>

        <div
          className={`${styles.quadraCard} ${
            styles.pagamentoCard
          }`}
        >

          <div className={styles.pixArea}>

            <div>

              <h4>
                Escaneie para pagar
              </h4>

              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagamentoArena"
                alt="QR Code"
                className={styles.qrCode}
              />

            </div>

            <div
              className={styles.valorArea}
            >

              <h3>
                Valor Total:
              </h3>

              <p>
                {valorFormatado}
              </p>

              {inscricao && (
                <small>
                  {inscricao.torneio}
                </small>
              )}

            </div>

          </div>

        </div>

        <div
          className={
            styles.pagamentoInfo
          }
        >

          <div>

            <h3>
              Descrição pagamento:
            </h3>

            <p>
              Realizado por via pix.
            </p>

            <p>
              Destinatário:
              xxx.xxx.xxx-xx
            </p>

            <p>
              Dia: 20/01/2026
            </p>

            <p>
              Horário: 13:00
            </p>

          </div>

          <div>

            <h3>
              Resumo do Agendamento
            </h3>

            <p>
              📍 Quadra 1
            </p>

            <p>
              📅 17/02/2026
            </p>

            <p>
              ⏰ 11:00 - 12:00
            </p>

          </div>

        </div>

        <button
          className={`${styles.activeBtn} ${
            styles.confirmarPagamento
          }`}
          onClick={() =>
            navigate("/home")
          }
        >
          Confirmar pagamento
        </button>

      </div>
    </div>
  );
}