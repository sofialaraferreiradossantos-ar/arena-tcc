import { useState } from "react";

import { FaBars, FaTimes, FaUserTag } from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

import styles from "../styles/torneios.module.css";

import logo from "../assets/logo.jpeg";

import TorneioCard from "../components/torneios/TorneioCard";
import MinhaCategoriaForm from "../components/torneios/MinhaCategoriaForm";

import {
  carregarMinhaCategoria,
  salvarMinhaCategoria,
  torneioCombina,
  torneiosMckp,
} from "../mockup/torneios.js";

function Torneios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [minhaCategoria, setMinhaCategoria] = useState(carregarMinhaCategoria);
  const [escolhendoCategoria, setEscolhendoCategoria] = useState(false);

  const torneios = torneiosMckp.filter((torneio) =>
    torneioCombina(torneio, minhaCategoria),
  );

  function atualizarMinhaCategoria(novaCategoria) {
    salvarMinhaCategoria(novaCategoria);
    setMinhaCategoria(novaCategoria);
    setEscolhendoCategoria(false);
  }

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* FUNDO DO MENU */}

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
          className={location.pathname === "/quadra" ? styles.active : ""}
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

      {/* CONTEÚDO */}

      <main className={styles.mainContent}>
        {/* BOTÃO MENU */}

        <FaBars
          className={styles.menuIcon}
          onClick={() => setMenuAberto(true)}
        />

        {/* CABEÇALHO */}

        <header className={styles.topHeader}>
          <span>
            Torneios <strong>Disponíveis</strong>
          </span>
        </header>

        {/* CONTEÚDO PRINCIPAL */}

        <section className={styles.content}>
          <h1>
            Torneios <span>Disponíveis</span>
          </h1>

          <div className={styles.titleLine} />

          <p className={styles.subtitle}>
            Confira os torneios disponíveis e participe das competições.
          </p>

          {/* MINHA CATEGORIA */}

          <div className={styles.minhaCategoria}>
            <button
              type="button"
              className={styles.categoriaPrimaryButton}
              onClick={() => setEscolhendoCategoria(true)}
            >
              <FaUserTag />
              <span>
                {minhaCategoria
                  ? "Alterar minha categoria"
                  : "Selecionar minha categoria"}
              </span>
            </button>

            {minhaCategoria && (
              <p className={styles.categoriaResumo}>
                <strong>
                  {minhaCategoria.genero} · {minhaCategoria.nivel} · Categoria{" "}
                  {minhaCategoria.categoria}
                </strong>{" "}
                — mostrando {torneios.length} de {torneiosMckp.length} torneios
                (do seu gênero e mistos).{" "}
                <button
                  type="button"
                  className={styles.verTodos}
                  onClick={() => atualizarMinhaCategoria(null)}
                >
                  Ver todos
                </button>
              </p>
            )}
          </div>

          {/* CARDS */}

          <div className={styles.cardsArea}>
            {torneios.map((torneio) => (
              <TorneioCard
                key={torneio.id}
                id={torneio.id}
                nome={torneio.nome}
                modalidade={torneio.modalidade}
                categoria={torneio.categoria}
                data={torneio.data}
                local={torneio.local}
                imagem={torneio.imagem}
              />
            ))}
          </div>
        </section>
      </main>

      {escolhendoCategoria && (
        <MinhaCategoriaForm
          atual={minhaCategoria}
          onSalvar={atualizarMinhaCategoria}
          onLimpar={() => atualizarMinhaCategoria(null)}
          onFechar={() => setEscolhendoCategoria(false)}
        />
      )}
    </div>
  );
}

export default Torneios;
