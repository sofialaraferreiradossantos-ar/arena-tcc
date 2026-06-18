import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/quadras.module.css";

import logo from "../assets/logo.jpeg";
import quadra from "../assets/quadra.jpeg";

function QuadraDetalhes() {
  const imagens = [quadra, quadra, quadra];

  const [imagemAtiva, setImagemAtiva] = useState(imagens[0]);
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className={styles.detailsContainer}>

      {/* BOTÃO MENU */}
<div
  className={`${styles.menuIcon} ${
    menuAberto ? styles.menuIconOpen : ""
  }`}
  onClick={() => setMenuAberto(!menuAberto)}
>
  ☰
</div>

{/* SIDEBAR */}
<div
  className={`${styles.sidebarMenu} ${
    menuAberto ? styles.open : ""
  }`}
>
  <img
    src={logo}
    alt="Arena Beach"
  />

  <Link to="/home">🏠 Início</Link>

  <Link to="/quadra">
    🌐 Quadras
  </Link>

  <Link to="/agendamentos">
    📅 Agendamentos
  </Link>

  <Link to="/torneios">
    🏆 Torneios
  </Link>

  <Link to="/pagamento">
    💳 Pagamento
  </Link>

  <Link to="/cadastro">
    🚪 Sair
  </Link>
</div>
      {/* LOGO */}
      <img
        src={logo}
        alt="Arena Beach"
        className={styles.logoDetails}
      />

      {/* TITULO */}
      <h1 className={styles.titleDetails}>
        Detalhes da <span>Quadra</span>
      </h1>

      <div className={styles.detailsContent}>

        {/* GALERIA */}
        <div className={styles.galleryBox}>
          <img
            src={imagemAtiva}
            alt="Quadra"
            className={styles.mainImage}
          />

          <div className={styles.thumbContainer}>
            {imagens.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className={`${styles.thumb} ${
                  imagemAtiva === img
                    ? styles.activeThumb
                    : ""
                }`}
                onClick={() => setImagemAtiva(img)}
              />
            ))}
          </div>
        </div>

        {/* CARD DIREITA */}
        <div className={styles.infoBox}>
          <h2>Beach Tennis Arena 1</h2>

          <div>
            <h3>Sobre a quadra</h3>

            <p>
              A quadra conta com iluminação LED,
              ambiente climatizado. Possui opções
              para agendamentos de evento,
              torneios e jogos.
            </p>
          </div>

          <div className={styles.horario}>
            <strong>
              Horário de Funcionamento:
            </strong>{" "}
            06:00 às 23:00
          </div>
        </div>

      </div>
    </div>
  );
}

export default QuadraDetalhes;