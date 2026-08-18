import { useState } from "react";

import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import styles from "../styles/inscricao.module.css";

import logo from "../assets/logo.jpeg";


function InscricaoTorneio() {

  const [menuAberto, setMenuAberto] = useState(false);

  const location = useLocation();

  const fecharMenu = () => {
    setMenuAberto(false);
  };


  return (
    <div className={styles.pageWrapper}>

      {/* FUNDO DO MENU */}

      {menuAberto && (
        <div
          className={styles.menuOverlay}
          onClick={fecharMenu}
        />
      )}


      {/* MENU LATERAL */}

      <aside
        className={`${styles.sidebarMenu} ${
          menuAberto ? styles.open : ""
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
          <span>🏠</span>
          Início
        </Link>


        <Link
          to="/quadra"
          onClick={fecharMenu}
          className={
            location.pathname === "/quadra"
              ? styles.active
              : ""
          }
        >
          <span>🏐</span>
          Quadras
        </Link>


        <Link
          to="/agendamentos"
          onClick={fecharMenu}
          className={
            location.pathname === "/agendamentos"
              ? styles.active
              : ""
          }
        >
          <span>📅</span>
          Agendamentos
        </Link>


        <Link
          to="/torneios"
          onClick={fecharMenu}
          className={
            location.pathname === "/torneios"
              ? styles.active
              : ""
          }
        >
          <span>🏆</span>
          Torneios
        </Link>


        <Link
          to="/pagamento"
          onClick={fecharMenu}
          className={
            location.pathname === "/pagamento"
              ? styles.active
              : ""
          }
        >
          <span>💳</span>
          Pagamento
        </Link>


        <Link
          to="/"
          onClick={fecharMenu}
          className={styles.sair}
        >
          <span>🚪</span>
          Sair
        </Link>

      </aside>


      {/* CONTEÚDO PRINCIPAL */}

      <main className={styles.mainContent}>

        {/* BOTÃO DO MENU */}

        <FaBars
          className={styles.menuIcon}
          onClick={() => setMenuAberto(true)}
        />


        {/* CABEÇALHO */}

        <header className={styles.header}>

          <img
            src={logo}
            alt="Arena Beach"
            className={styles.logo}
          />

          <div>

            <h1>
              Inscrição no <span>Torneio</span>
            </h1>

            <p>
              Preencha seus dados para participar.
            </p>

          </div>

        </header>


        {/* CARD PRINCIPAL */}

        <section className={styles.inscricaoCard}>


          {/* INFORMAÇÕES DO TORNEIO */}

          <div className={styles.torneioInfo}>

            <div className={styles.infoHeader}>

              <div className={styles.trophyIcon}>
                <FaTrophy />
              </div>

              <div>

                <small>
                  TORNEIO
                </small>

                <h2>
                  Torneio de Futevôlei Pro
                </h2>

              </div>

            </div>


            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>

                <FaCalendarAlt />

                <div>

                  <small>
                    Data
                  </small>

                  <strong>
                    25/05 a 25/06
                  </strong>

                </div>

              </div>


              <div className={styles.infoItem}>

                <FaMapMarkerAlt />

                <div>

                  <small>
                    Local
                  </small>

                  <strong>
                    Beach Tennis Arena 1
                  </strong>

                </div>

              </div>


              <div className={styles.infoItem}>

                <FaMoneyBillWave />

                <div>

                  <small>
                    Valor da inscrição
                  </small>

                  <strong>
                    R$ 100,00
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* FORMULÁRIO */}

          <div className={styles.formSection}>

            <h2>
              Dados do participante
            </h2>

            <p>
              Informe seus dados para realizar a inscrição.
            </p>


            <div className={styles.formGrid}>


              <div className={styles.inputGroup}>

                <label>
                  Nome completo
                </label>

                <input
                  type="text"
                  placeholder="Digite seu nome completo"
                />

              </div>


              <div className={styles.inputGroup}>

                <label>
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                />

              </div>


              <div className={styles.inputGroup}>

                <label>
                  Telefone
                </label>

                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                />

              </div>


              <div className={styles.inputGroup}>

                <label>
                  CPF
                </label>

                <input
                  type="text"
                  placeholder="000.000.000-00"
                />

              </div>

            </div>


            {/* RESUMO DA INSCRIÇÃO */}

            <div className={styles.resumo}>

              <div>

                <span>
                  Inscrição no torneio
                </span>

                <strong>
                  R$ 100,00
                </strong>

              </div>


              <div>

                <span>
                  Forma de pagamento
                </span>

                <strong>
                  A definir
                </strong>

              </div>


              <div className={styles.total}>

                <span>
                  Total
                </span>

                <strong>
                  R$ 100,00
                </strong>

              </div>

            </div>


            {/* BOTÃO */}

            <button
              className={styles.confirmarButton}
            >
              Confirmar inscrição
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}


export default InscricaoTorneio;