import {
  FaInfoCircle,
  FaClock,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Header from "../../components/quadras/Header";
import styles from "../../styles/home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Header
        title="ARENA"
        highlight="BEACH"
      />

      <main className={styles.app}>
        <div className={styles.contentCard}>
          <header className={styles.hero}>
            <h1>
              Bem-vindo à <span>Arena Beach</span>
            </h1>

            <p>
              Seu espaço para reservar quadras,
              participar de torneios e viver o esporte.
            </p>
          </header>

          <section className={styles.section}>
            <h3>
              <FaInfoCircle /> Sobre nós
            </h3>

            <p>
              A Arena Beach é o espaço ideal para quem ama esportes
              de areia. Aqui você encontra quadras de Beach Tennis,
              vôlei e futebol, além de torneios e uma estrutura
              completa para aproveitar com os amigos.
            </p>
          </section>

          <section className={styles.section}>
            <h3>
              <FaClock /> Horário de funcionamento
            </h3>

            <p>Segunda à sexta-feira: 08:00 / 21:00</p>
            <p>Sábado: 08:00 / 18:00</p>
            <p>Domingo: Fechado</p>

            <small>
              Os horários podem sofrer alterações em feriados locais
              e nacionais.
            </small>
          </section>

          <section className={styles.section}>
            <h3>
              <FaPhoneAlt /> Suporte
            </h3>

            <div className={styles.inlineInfo}>
              <FaPhoneAlt />
              <span>(14) 99835-8654</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3>
              <FaMapMarkerAlt /> Endereço
            </h3>

            <p>Rua xxxxxxxx - Jaú/SP, 17200-000</p>
          </section>
        </div>
      </main>
    </div>
  );
}

