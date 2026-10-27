import { useState } from "react";

import { FaBars, FaTimes } from "react-icons/fa";

import { Link, useParams, useLocation } from "react-router-dom";

import styles from "../styles/quadras.module.css";

import logo from "../assets/logo.jpeg";
import {
  listaModalidades,
  nomesModalidades,
  quadrasMckp,
} from "../mockup/dados.js";
import useDisponibilidadeQuadras, {
  comDisponibilidade,
} from "../hooks/useDisponibilidadeQuadras.js";

const DESCRICOES = {
  "beach-tennis":
    "Quadra de areia preparada para o beach tennis, com rede na altura oficial e marcações visíveis. Ideal para jogos em dupla, aulas e treinos, do iniciante ao avançado.",
  futevolei:
    "Quadra de areia preparada para o futevôlei, com rede na altura oficial e espaço livre ao redor para as jogadas. Ideal para partidas entre amigos, treinos e aulas.",
  multiuso:
    "Quadra de areia preparada para o beach tennis e o futevôlei, com rede na altura oficial, marcações visíveis e espaço livre ao redor para as jogadas. Ideal para jogos em dupla, partidas entre amigos, aulas e treinos.",
};

function QuadraDetalhes() {
  const { id } = useParams();
  // Disponível/indisponível vem do banco (o admin muda em Administração > Quadras)
  const disponibilidade = useDisponibilidadeQuadras();
  const quadraSelecionada = comDisponibilidade(
    quadrasMckp.find((item) => item.id === Number(id)) || quadrasMckp[0],
    disponibilidade,
  );
  const modalidade = nomesModalidades(quadraSelecionada) || "Beach tennis";
  const listaDaQuadra = listaModalidades(quadraSelecionada);
  const chaveDescricao =
    listaDaQuadra.length > 1 ? "multiuso" : listaDaQuadra[0];
  const estrutura = [
    ...quadraSelecionada.destaques
      .split(" • ")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1)),
    "Agendamento online",
    "Eventos e torneios",
  ];

  const [menuAberto, setMenuAberto] = useState(false);

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

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
            <span className={styles.infoTag}>{modalidade}</span>
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
              {DESCRICOES[chaveDescricao] ||
                DESCRICOES["beach-tennis"]}{" "}
              A quadra conta com iluminação LED e areia selecionada, e pode ser
              reservada para jogos, eventos e torneios.
            </p>
          </div>

          <div>
            <h3>Estrutura</h3>

            <ul className={styles.estrutura}>
              {estrutura.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.horario}>
            <strong>Horário de Funcionamento:</strong> 06:00 às 23:00
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
