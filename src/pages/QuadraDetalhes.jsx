import { useState } from "react";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import styles from "../styles/quadras.module.css";

import logo from "../assets/logo.jpeg";
import quadra from "../assets/quadra.jpeg";


function QuadraDetalhes() {
  const imagens = [
    quadra,
    quadra,
    quadra,
  ];

  const [
    imagemAtiva,
    setImagemAtiva,
  ] = useState(0);

  const [
    menuAberto,
    setMenuAberto,
  ] = useState(false);

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className={styles.detailsContainer}>

      {/* FUNDO ESCURO */}
      {menuAberto && (
        <div
          className={styles.menuOverlay}
          onClick={fecharMenu}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`${styles.sidebarMenu} ${
          menuAberto
            ? styles.open
            : ""
        }`}
      >

        <button
          className={styles.closeMenu}
          onClick={fecharMenu}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>

        <img
          src={logo}
          alt="Arena Beach"
        />

        <Link
          to="/home"
          onClick={fecharMenu}
          className={
            location.pathname === "/home"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏠
          </span>

          Início
        </Link>

        <Link
          to="/quadra"
          onClick={fecharMenu}
          className={
            location.pathname === "/quadras" ||
            location.pathname === "/quadra"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏐
          </span>

          Quadras
        </Link>

        <Link
          to="/agendar-horario"
          onClick={fecharMenu}
          className={
            location.pathname ===
            "/agendar-horario"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🕐
          </span>

          Agendar Horário
        </Link>

        <Link
          to="/agendamentos"
          onClick={fecharMenu}
          className={
            location.pathname ===
            "/agendamentos"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            📅
          </span>

          Agendamentos
        </Link>

        <Link
          to="/torneios"
          onClick={fecharMenu}
          className={
            location.pathname ===
            "/torneios"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            🏆
          </span>

          Torneios
        </Link>

        <Link
          to="/pagamento"
          onClick={fecharMenu}
          className={
            location.pathname ===
            "/pagamento"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>
            💳
          </span>

          Pagamento
        </Link>

        <Link
          to="/"
          onClick={fecharMenu}
          className={styles.sair}
        >
          <span className={styles.menuEmoji}>
            🚪
          </span>

          Sair
        </Link>

      </aside>

      {/* BOTÃO PARA ABRIR */}
      <FaBars
        className={styles.menuIcon}
        onClick={() =>
          setMenuAberto(true)
        }
      />

      {/* LOGO */}
      <img
        src={logo}
        alt="Arena Beach"
        className={styles.logoDetails}
      />

      {/* TÍTULO */}
      <h1
        className={styles.titleDetails}
      >
        Detalhes da{" "}

        <span>
          Quadra
        </span>
      </h1>

      <div
        className={styles.detailsContent}
      >

        {/* GALERIA */}
        <div
          className={styles.galleryBox}
        >

          <img
            src={imagens[imagemAtiva]}
            alt="Quadra"
            className={styles.mainImage}
          />

         <div className={styles.thumbContainer}>
  {imagens.map((img, index) => (
    <img
      key={index}
      src={img}
      alt={`Quadra ${index + 1}`}
      className={`${styles.thumb} ${
        imagemAtiva === index ? styles.activeThumb : ""
      }`}
      onClick={() => setImagemAtiva(index)}
    />
  ))}
</div>

        </div>

        {/* INFORMAÇÕES */}
        <div
          className={styles.infoBox}
        >

          <h2>
            Beach Tennis Arena 1
          </h2>

          <div>

            <h3>
              Sobre a quadra
            </h3>

            <p>
              A quadra conta com
              iluminação LED,
              ambiente climatizado.
              Possui opções para
              agendamentos de
              eventos, torneios e
              jogos.
            </p>

          </div>

          <div
            className={styles.horario}
          >

            <strong>
              Horário de
              Funcionamento:
            </strong>

            {" "}

            06:00 às 23:00

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuadraDetalhes;