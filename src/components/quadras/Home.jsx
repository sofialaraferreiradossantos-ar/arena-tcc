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
        <section className={styles.pageTitle}>
          <div>
            <h1>
              Bem-vindo à <span>Arena Beach</span>
            </h1>

            <p>
              Seu espaço para reservar quadras,
              participar de torneios e viver o esporte.
            </p>
          </div>
        </section>

        <section className={styles.homeCards}>
          <article className={styles.infoCard}>
            <h3>
              <span className={styles.infoCardIcon}><FaInfoCircle /></span>
              Sobre nós
            </h3>

            <p>
              A Arena Beach é o espaço ideal para quem ama esportes
              de areia. Aqui você encontra quadras de Beach Tennis,
              vôlei e futebol, além de torneios e uma estrutura
              completa para aproveitar com os amigos.
            </p>
          </article>

          <article className={styles.infoCard}>
            <h3>
              <span className={styles.infoCardIcon}><FaClock /></span>
              Horário de funcionamento
            </h3>

            <div className={styles.scheduleList}>
              <p><span>Segunda à sexta-feira</span><strong>08:00 / 21:00</strong></p>
              <p><span>Sábado</span><strong>08:00 / 18:00</strong></p>
              <p><span>Domingo</span><strong>Fechado</strong></p>
            </div>

            <small>
              Os horários podem sofrer alterações em feriados locais
              e nacionais.
            </small>
          </article>

          <article className={styles.infoCard}>
            <h3>
              <span className={styles.infoCardIcon}><FaPhoneAlt /></span>
              Suporte
            </h3>

            <div className={styles.inlineInfo}>
              <FaPhoneAlt />
              <span>(14) 99835-8654</span>
            </div>
          </article>

          <article className={styles.infoCard}>
            <h3>
              <span className={styles.infoCardIcon}><FaMapMarkerAlt /></span>
              Endereço
            </h3>

            <p>Rua xxxxxxxx - Jaú/SP, 17200-000</p>
          </article>
        </section>
      </main>
    </div>
  );
}

