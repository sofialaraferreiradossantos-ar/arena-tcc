import { useState } from "react";
import styles from "../styles/home.module.css";

export default function Pagamento() {
  const [metodo, setMetodo] = useState("pix");

  return (
    <div className={styles.container}>
      <div className={styles.app}>

        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <h2>
              <span>Pagamento</span>
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
            onClick={() => setMetodo("pix")}
          >
            Pix
          </button>

          <button
            className={
              metodo === "cartao"
                ? `${styles.activeBtn} ${styles.pagamentoBtn}`
                : styles.pagamentoBtn
            }
            onClick={() => setMetodo("cartao")}
          >
            Cartão
          </button>
        </div>

        <div className={`${styles.quadraCard} ${styles.pagamentoCard}`}>
          <div className={styles.pixArea}>
            <div>
              <h4>Escaneie para pagar</h4>

              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagamentoArena"
                alt="QR Code"
                className={styles.qrCode}
              />
            </div>

            <div className={styles.valorArea}>
              <h3>Valor Total:</h3>
              <p>R$100,00</p>
            </div>
          </div>
        </div>

        <div className={styles.pagamentoInfo}>
          <div>
            <h3>Descrição pagamento:</h3>

            <p>Realizado por via pix.</p>
            <p>Destinatário: xxx.xxx.xxx-xx</p>
            <p>Dia: 20/01/2026</p>
            <p>Horário: 13:00</p>
          </div>

          <div>
            <h3>Resumo do Agendamento</h3>

            <p>📍 Quadra 1</p>
            <p>📅 17/02/2026</p>
            <p>⏰ 11:00 - 12:00</p>
          </div>
        </div>

        <button
          className={`${styles.activeBtn} ${styles.confirmarPagamento}`}
        >
          Confirmar pagamento
        </button>

      </div>
    </div>
  );
}