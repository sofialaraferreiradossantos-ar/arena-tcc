import { Link } from "react-router-dom";
import styles from "../../styles/home.module.css";
import logo from "../../assets/logo.jpeg";

export default function RecuperarSenha() {
  return <main className={styles.authPage}>
    <section className={`${styles.authCard} ${styles.authCardSmall}`}>
      <div className={styles.authBrand}><img src={logo} alt="Arena Beach" /><strong>ARENA <span>BEACH</span></strong></div>
      <div className={styles.authHeading}><small>RECUPERAÇÃO DE ACESSO</small><h1>Esqueceu sua senha?</h1><p>Informe seu e-mail e enviaremos as instruções de recuperação.</p></div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>E-mail<input type="email" placeholder="voce@email.com" required /></label>
        <button type="submit">Enviar instruções</button>
      </form>
      <p className={styles.authSwitch}><Link to="/login">← Voltar para o login</Link></p>
    </section>
  </main>;
}
