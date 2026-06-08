import { Link } from "react-router-dom";
import styles from "../../styles/home.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.app}>

        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <h2>
              Arena <span>Beach</span>
            </h2>
          </div>
        </div>

        <div className={`${styles.quadraCard} ${styles.loginCard}`}>

          <h2 className={styles.loginTitle}>
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className={styles.loginInput}
          />

          <input
            type="password"
            placeholder="Senha"
            className={styles.loginInput}
          />

          <button
            className={`${styles.activeBtn} ${styles.loginButton}`}
          >
            Entrar
          </button>

          <div className={styles.loginLinks}>
            <p>
              <Link
                to="/recuperar-senha"
                className={styles.loginLink}
              >
                Esqueceu a senha?
              </Link>
            </p>

            <p>
              Não tem conta?{" "}
              <Link
                to="/cadastro"
                className={styles.loginLink}
              >
                cadastre-se
              </Link>
            </p>

            <p>
              <Link
                to="/sobre"
                className={styles.loginLink}
              >
                Sobre
              </Link>
            </p>

            <p>
              <Link
                to="/home"
                className={styles.loginLink}
              >
                Home
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}