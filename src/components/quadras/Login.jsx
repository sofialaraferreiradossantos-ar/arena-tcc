import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.authHeader}>
        <Link to="/login" className={styles.authBrand} aria-label="Arena Beach">
          <img src={logo} alt="Arena Beach" />
          <strong>ARENA <span>BEACH</span></strong>
        </Link>
      </header>
      <main className={styles.authContent}>
        <section className={styles.loginCard}>
          <div className={styles.authHeading}>
            <span>Acesso à Arena</span>

          <h2 className={styles.loginTitle}>
            Entre na sua conta
          </h2>
            <p>Use seus dados para acessar reservas e torneios.</p>
          </div>

          <label className={styles.authField}>
            <span>E-mail</span>
            <div><FaEnvelope /><input type="email" placeholder="seu@email.com" className={styles.loginInput} /></div>
          </label>

          <label className={styles.authField}>
            <span>Senha</span>
            <div><FaLock /><input type="password" placeholder="Digite sua senha" className={styles.loginInput} /></div>
          </label>

          <button
            className={`${styles.activeBtn} ${styles.loginButton}`}
            onClick={() => navigate("/home")}
          >
            Entrar
          </button>

          <div className={styles.loginLinks}>
            <p>
              <Link
                to="/recuperarSenha"
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

          </div>

        </section>
      </main>
    </div>
  );
}
