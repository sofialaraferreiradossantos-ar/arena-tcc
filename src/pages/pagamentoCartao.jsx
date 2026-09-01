import styles from "../styles/home.module.css";
import { useNavigate } from "react-router-dom";

export default function PagamentoCartao() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <main className={`${styles.app} ${styles.paymentPage} ${styles.cardPaymentPage}`}>
        <header className={styles.paymentHeading}>
          <span>PAGAMENTO COM CARTÃO</span>
          <h1>Dados do cartão</h1>
          <p>Preencha os dados abaixo para confirmar seu agendamento.</p>
        </header>

        <div className={styles.pagamentoButtons}>
          <button
            className={styles.pagamentoBtn}
            onClick={() => navigate("/pagamento")}
          >
            Pix
          </button>

          <button
            className={`${styles.activeBtn} ${styles.pagamentoBtn}`}
          >
            Cartão
          </button>
        </div>

        <div className={styles.pagamentoContainer}>

          <div className={styles.formPagamento}>

            <label>Número do cartão</label>

            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className={styles.loginInput}
            />

            <label>Nome impresso no cartão</label>

            <input
              type="text"
              placeholder="Como aparece no cartão"
              className={styles.loginInput}
            />

            <div className={styles.rowPagamento}>

              <div>
                <label>Validade</label>

                <input
                  type="text"
                  placeholder="MM/AA"
                  className={styles.loginInput}
                />
              </div>

              <div>
                <label>CVV</label>

                <input
                  type="text"
                  placeholder="000"
                  className={styles.loginInput}
                />
              </div>

            </div>

            <div className={styles.rowPagamento}>

              <div>
                <label>Função</label>

                <input
                  type="text"
                  placeholder="Débito/Crédito"
                  className={styles.loginInput}
                />
              </div>

              <div>
                <label>Bandeira</label>

                <input
                  type="text"
                  placeholder="💳"
                  className={styles.loginInput}
                />
              </div>

            </div>

            <label>Parcelas</label>

            <input
              type="text"
              placeholder="1x de R$100,00 (sem juros)"
              className={styles.loginInput}
            />

          </div>

          <div className={styles.resumoPagamento}>

            <h3>
              Resumo do Agendamento
            </h3>

            <p>📍 Quadra 1</p>
            <p>📅 17/02/2026</p>
            <p>🕐 11:00 - 12:00</p>

            <button
              className={styles.confirmarPagamento}
              onClick={() => navigate("/home")}
            >
              Confirmar pagamento
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}
