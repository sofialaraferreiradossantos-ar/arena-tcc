import { useState } from "react";
import { FaBars, FaHome, FaGlobe, FaCalendarAlt, FaTrophy, FaCreditCard, FaRegUserCircle } from "react-icons/fa";
import styles from "../styles/torneios.module.css";
import logo from "../assets/logo.jpeg";
import InscricaoForm from "../components/torneios/InscricaoForm";
import InscricaoResumo from "../components/torneios/InscricaoResumo";

function InscricaoTorneio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  return (
    <div className={styles.pageWrapper}>

      {/* SIDEBAR FIXA */}
      <div className={styles.sidebarMenu}>
        <img src={logo} alt="logo" />
        <a href="/"><FaHome /> Início</a>
        <a href="/quadras"><FaGlobe /> Quadras</a>
        <a href="/agendamentos"><FaCalendarAlt /> Agendamentos</a>
        <a href="/torneios"><FaTrophy /> Torneios</a>
        <a href="/pagamento"><FaCreditCard /> Pagamento</a>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className={styles.mainContent}>

        <div className={styles.topHeader}>
          <FaBars
            className={styles.menuIcon}
            onClick={() => setMenuAberto(!menuAberto)}
          />
          <FaRegUserCircle className={styles.userIcon} />
        </div>

        <div className={styles.inscricaoWrapper}>
          <InscricaoForm
            nome={nome}
            email={email}
            telefone={telefone}
            setNome={setNome}
            setEmail={setEmail}
            setTelefone={setTelefone}
          />
          <InscricaoResumo onConfirmar={() => alert("Inscrição confirmada!")} />
        </div>

      </div>
    </div>
  );
}

export default InscricaoTorneio;