import { useState } from "react";
import { FaBars } from "react-icons/fa";
import styles from "../styles/torneios.module.css";
import logo from "../assets/logo.jpeg";
import TorneioCard from "../components/torneios/TorneioCard";
import quadra1 from "../mockup/imagens/quadraCoberta.jpg";
import { useNavigate } from "react-router-dom";

const torneios = [
  {
    id: 1,
    nome: "Torneio de Futevôlei Pro",
    data: "25/05 a 25/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
  {
    id: 2,
    nome: "Torneio de Futevôlei Pro",
    data: "14/06 a 24/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
  {
    id: 3,
    nome: "Torneio de Futevôlei Pro",
    data: "30/05 a 30/06",
    local: "Beach Tennis Arena 1",
    imagem: quadra1,
  },
];

function Torneios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      {/* MENU LATERAL */}
      <div
        className={`${styles.sidebarMenu} ${
          menuAberto ? styles.open : ""
        }`}
      >
        <button
          className={styles.closeMenu}
          onClick={() => setMenuAberto(false)}
        >
          
        </button>

        <img src={logo} alt="logo" />

        <a href="/home">🏠 Início</a>
        <a href="/quadras">⚽ Quadras</a>
        <a href="/agendamentos">📅 Agendamentos</a>
        <a href="/torneios">🏆 Torneios</a>
        <a href="/pagamento">💳 Pagamento</a>
      </div>

      {/* CONTEÚDO */}
      <div className={styles.mainContent}>
        <FaBars
          className={styles.menuIcon}
          onClick={() => setMenuAberto(true)}
        />

        <div className={styles.phoneContainer}>
          <img src={logo} alt="logo" className={styles.logo} />

          <h2>
            Torneios <span>Disponíveis</span>
          </h2>

          <div className={styles.cardsArea}>
            {torneios.map((t) => (
              <TorneioCard
                key={t.id}
                nome={t.nome}
                data={t.data}
                local={t.local}
                imagem={t.imagem}
              />
            ))}
          </div>

          <button
            className={styles.inscricaoBtn}
            onClick={() => navigate("/inscricao-torneio")}
          >
            Inscrever-se
          </button>
        </div>
      </div>
    </div>
  );
}

export default Torneios;