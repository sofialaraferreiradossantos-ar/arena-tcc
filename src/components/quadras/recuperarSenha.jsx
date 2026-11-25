import styles from "../../styles/home.module.css";

export default function RecuperarSenha() {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard + " " + styles.authCardSmall}>
        <div className={styles.authBrand}>
          <strong>
            ARENA <span>BEACH</span>
          </strong>
        </div>
        <div className={styles.authHeading}>
          <small>RECUPERAÇÃO DE ACESSO</small>
          <h1>Esqueceu sua senha?</h1>
          {/* O sistema não envia e-mails: a senha é redefinida pela arena,
              depois de confirmar quem é o cliente. */}
          <p>
            Entre em contato com a administração da Arena Beach pelo telefone{" "}
            <strong>(14) 90000-0000</strong>, informando o e-mail da sua conta.
            Depois de confirmar seus dados, a equipe da arena redefine o seu
            acesso.
          </p>
          <p>
            Se você lembra a senha atual e só quer trocá-la, entre na sua conta
            normalmente.
          </p>
        </div>
      </section>
    </main>
  );
}
