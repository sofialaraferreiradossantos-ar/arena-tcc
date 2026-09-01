import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/home.module.css";

export default function Cadastro() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <h2>
              Criar <span>Conta</span>
            </h2>
          </div>
        </div>

        <div className={`${styles.quadraCard} ${styles.cadastroCard}`}>
          <h2 className={styles.cadastroTitle}>
            Cadastro de usuário
          </h2>

          <input
            type="text"
            placeholder="Nome"
            className={styles.cadastroInput}
          />

          <input
            type="email"
            placeholder="Email"
            className={styles.cadastroInput}
          />

          <input
            type="password"
            placeholder="Senha"
            className={styles.cadastroInput}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className={styles.cadastroInput}
          />

          <button
            className={`${styles.activeBtn} ${styles.cadastroButton}`}
            onClick={() => navigate("/home")}
          >
            Cadastrar
          </button>

          <p className={styles.cadastroText}>
            Já tem conta?{" "}
            <Link
              to="/login"
              className={styles.cadastroLink}
            >
              entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}