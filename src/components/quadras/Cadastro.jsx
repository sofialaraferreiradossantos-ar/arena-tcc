import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";
import logo from "../../assets/logo.jpeg";

export default function Cadastro() {
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
        <section className={styles.cadastroCard}>
          <div className={styles.authHeading}>
            <span>Junte-se à Arena</span>
            <h2 className={styles.cadastroTitle}>Crie sua conta</h2>
            <p>Cadastre-se para reservar quadras e participar dos torneios.</p>
          </div>

          <label className={styles.authField}>
            <span>Nome</span>
            <div><FaUser /><input type="text" placeholder="Seu nome completo" className={styles.cadastroInput} /></div>
          </label>
          <label className={styles.authField}>
            <span>E-mail</span>
            <div><FaEnvelope /><input type="email" placeholder="seu@email.com" className={styles.cadastroInput} /></div>
          </label>
          <div className={styles.authFieldRow}>
            <label className={styles.authField}>
              <span>Senha</span>
              <div><FaLock /><input type="password" placeholder="Crie uma senha" className={styles.cadastroInput} /></div>
            </label>
            <label className={styles.authField}>
              <span>Confirmar senha</span>
              <div><FaLock /><input type="password" placeholder="Repita a senha" className={styles.cadastroInput} /></div>
            </label>
          </div>

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
        </section>
      </main>
    </div>
  );
  return <main className={styles.authPage}>
    <section className={styles.authCard}>
      <div className={styles.authBrand}><img src={logo} alt="Arena Beach" /><strong>ARENA <span>BEACH</span></strong></div>
      <div className={styles.authHeading}><small>SEJA BEM-VINDO</small><h1>Crie sua conta</h1><p>Cadastre-se para reservar quadras e participar dos torneios.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); navigate("/home"); }}>
        <label>Nome completo<input type="text" placeholder="Digite seu nome" /></label>
        <label>E-mail<input type="email" placeholder="voce@email.com" /></label>
        <div className={styles.authRow}><label>Senha<input type="password" placeholder="Mínimo 6 caracteres" /></label><label>Confirmar senha<input type="password" placeholder="Repita a senha" /></label></div>
        <button type="submit">Criar conta</button>
      </form>
      <p className={styles.authSwitch}>Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </section>
  </main>;
}
