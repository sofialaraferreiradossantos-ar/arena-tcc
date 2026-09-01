import styles from "../../styles/torneios.module.css";

function InscricaoForm({ nome, email, telefone, setNome, setEmail, setTelefone }) {
  return (
    <div className={styles.formBox}>
      <h2>Inscrição no <span>Torneio</span></h2>

      <input
        type="text"
        placeholder="Seu Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="tel"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className={styles.input}
      />

      <button className={styles.pagamentoBtn}>Realizar pagamento</button>
    </div>
  );
}

export default InscricaoForm;