import { useState } from "react";

import { FaBars, FaTimes } from "react-icons/fa";

import { Link, useParams, useLocation } from "react-router-dom";

import styles from "../styles/quadras.module.css";

import logo from "../assets/logo.jpeg";
import { formatarValor, useQuadras } from "../services/quadras.js";

// Estrutura da arena (é a mesma em todas as quadras)
const ESTRUTURA = [
  "Iluminação LED",
  "Areia selecionada",
  "Agendamento online",
  "Eventos e torneios",
];

function QuadraDetalhes() {
  const { id } = useParams();
  // Quadras do banco de dados (GET /quadras)
  const { quadras, carregando, erro } = useQuadras();
  const quadraSelecionada =
    quadras.find((item) => item.id === Number(id)) || quadras[0];

  const [menuAberto, setMenuAberto] = useState(false);

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  if (!quadraSelecionada) {
    return (
      <div className={styles.detailsContainer}>
        <h1 className={styles.titleDetails}>
          Detalhes da <span>Quadra</span>
        </h1>
        <p className={styles.avisoIndisponivel}>
          {carregando ? "Carregando quadra..." : erro || "Quadra não encontrada."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      {/* FUNDO ESCURO */}
      {menuAberto && (
        <div className={styles.menuOverlay} onClick={fecharMenu} />
      )}

      {/* MENU LATERAL */}
      <aside
        className={`${styles.sidebarMenu} ${menuAberto ? styles.open : ""}`}
      >
        <button
          className={styles.closeMenu}
          onClick={fecharMenu}
          aria-label="Fechar menu"
        >
          <FaTimes />
        </button>

        <img src={logo} alt="Arena Beach" />

        <Link
          to="/home"
          onClick={fecharMenu}
          className={location.pathname === "/home" ? styles.active : ""}
        >
          <span className={styles.menuEmoji}>🏠</span>
          Início
        </Link>

        <Link
          to="/quadra"
          onClick={fecharMenu}
          className={
            location.pathname === "/quadras" || location.pathname === "/quadra"
              ? styles.active
              : ""
          }
        >
          <span className={styles.menuEmoji}>🎾</span>
          Quadras
        </Link>

        <Link
          to="/agendar-horario"
          onClick={fecharMenu}
          className={
            location.pathname === "/agendar-horario" ? styles.active : ""
          }
        >
          <span className={styles.menuEmoji}>🕐</span>
          Agendar Horário
        </Link>

        <Link
          to="/agendamentos"
          onClick={fecharMenu}
          className={location.pathname === "/agendamentos" ? styles.active : ""}
        >
          <span className={styles.menuEmoji}>📅</span>
          Agendamentos
        </Link>

        <Link
          to="/torneios"
          onClick={fecharMenu}
          className={location.pathname === "/torneios" ? styles.active : ""}
        >
          <span className={styles.menuEmoji}>🏆</span>
          Torneios
        </Link>

        <Link
          to="/pagamento"
          onClick={fecharMenu}
          className={location.pathname === "/pagamento" ? styles.active : ""}
        >
          <span className={styles.menuEmoji}>💳</span>
          Pagamento
        </Link>

        <Link to="/" onClick={fecharMenu} className={styles.sair}>
          <span className={styles.menuEmoji}>🚪</span>
          Sair
        </Link>
      </aside>

      {/* BOTÃO PARA ABRIR */}
      <FaBars className={styles.menuIcon} onClick={() => setMenuAberto(true)} />

      {/* O botão Voltar agora fica no menu do topo (UnifiedMenu) */}

      {/* TÍTULO */}
      <h1 className={styles.titleDetails}>
        Detalhes da <span>Quadra</span>
      </h1>

      <div className={styles.detailsContent}>
        {/* IMAGEM DA QUADRA */}
        <div className={styles.galleryBox}>
          <img
            src={quadraSelecionada.image}
            alt={quadraSelecionada.title}
            className={styles.mainImage}
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className={styles.infoBox}>
          <h2>{quadraSelecionada.title}</h2>

          <p className={styles.location}>
            {quadraSelecionada.cidade} - {quadraSelecionada.uf}
          </p>

          <div className={styles.infoTags}>
            <span className={styles.infoTag}>{quadraSelecionada.tipo}</span>
            <span className={styles.infoTag}>
              {formatarValor(quadraSelecionada.valor)} por hora
            </span>
            <span
              className={`${styles.infoTag} ${
                quadraSelecionada.available
                  ? styles.tagDisponivel
                  : styles.tagIndisponivel
              }`}
            >
              {quadraSelecionada.available ? "Disponível" : "Indisponível"}
            </span>
          </div>

          <div>
            <h3>Sobre a quadra</h3>

            <p>
              {quadraSelecionada.descricao}. A quadra pode ser reservada para
              jogos, aulas, eventos e torneios.
            </p>
          </div>

          <div>
            <h3>Estrutura</h3>

            <ul className={styles.estrutura}>
              {ESTRUTURA.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.horario}>
            <strong>Horário de Funcionamento:</strong> segunda a sexta, das 08h
            às 21h; sábado, das 08h às 18h
          </div>

          {quadraSelecionada.available ? (
            <Link to="/agendar-horario" className={styles.agendarPrimary}>
              Agendar horário
            </Link>
          ) : (
            <p className={styles.avisoIndisponivel}>
              Esta quadra está indisponível no momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuadraDetalhes;
