import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

export default function Cadastro() {
  const navigate = useNavigate();
  return <main className={styles.authPage}>
    <section className={styles.authCard}>
      <div className={styles.authBrand}><img src={logo} alt="Arena Beach" /><strong>ARENA <span>BEACH</span></strong></div>
      <div className={styles.authHeading}><small>SEJA BEM-VINDO</small><h1>Crie sua conta</h1><p>Cadastre-se para reservar quadras e participar dos torneios.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); navigate("/home"); }}>
        <label>Nome completo<input type="text" placeholder="Digite seu nome" required /></label>
        <label>E-mail<input type="email" placeholder="voce@email.com" required /></label>
        <div className={styles.authRow}><label>Senha<input type="password" placeholder="Mínimo 6 caracteres" minLength={6} required /></label><label>Confirmar senha<input type="password" placeholder="Repita a senha" minLength={6} required /></label></div>
        <button type="submit">Criar conta</button>
      </form>
      <p className={styles.authSwitch}>Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </section>
  </main>;
}
