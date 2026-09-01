import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import styles from "../../styles/home.module.css";

export default function Login() {
  const navigate = useNavigate();
  return <main className={styles.authPage}>
    <section className={`${styles.authCard} ${styles.authCardSmall}`}>
      <div className={styles.authBrand}><img src={logo} alt="Arena Beach" /><strong>ARENA <span>BEACH</span></strong></div>
      <div className={styles.authHeading}><small>ÁREA DO CLIENTE</small><h1>Entre na sua conta</h1><p>Acesse suas reservas e continue jogando.</p></div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>E-mail<input type="email" placeholder="voce@email.com" /></label>
        <label>Senha<input type="password" placeholder="Digite sua senha" /></label>
        <Link to="/recuperarSenha" className={styles.forgotLink}>Esqueceu a senha?</Link>
        <button type="button" onClick={() => navigate("/home")}>Entrar</button>
      </form>
      <p className={styles.authSwitch}>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      <Link to="/sobre" className={styles.aboutLink}>Conheça a Arena Beach</Link>
    </section>
  </main>;
}
