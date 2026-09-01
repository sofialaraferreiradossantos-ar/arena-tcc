import { Link } from "react-router-dom";
import styles from "../../styles/home.module.css";

export default function RecuperarSenha() {
  return (
    <div className={styles.container}>
      <div className={styles.app}>

        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <h2>
              Recuperar <span>Senha</span>
            </h2>
          </div>
        </div>

        <div className={`${styles.quadraCard} ${styles.recuperarCard}`}>

          <h2 className={styles.recuperarTitle}>
            Esqueceu sua senha?
          </h2>

          <p className={styles.recuperarText}>
            Digite seu e-mail para receber as instruções de recuperação.
          </p>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            className={styles.cadastroInput}
          />

          <button
            className={`${styles.activeBtn} ${styles.recuperarButton}`}
          >
            Enviar código
          </button>

          <Link
            to="/login"
            className={styles.recuperarLink}
          >
            Voltar para o login
          </Link>

        </div>

      </div>
    </div>
  );
}