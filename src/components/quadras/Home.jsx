import { FaClock, FaMapMarkerAlt, FaPhoneAlt, FaVolleyballBall } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "./Header";
import styles from "../../styles/home.module.css";

export default function Home() {
  return <div className={styles.container}>
    <Header />
    <main className={styles.app}>
      <div className={styles.contentCard}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Bem-vindo</span>
          <h1>Arena <span>Beach</span></h1>
          <p>Seu espaço para reservar quadras, participar de torneios e viver o esporte.</p>
          <div className={styles.heroActions}>
            <Link to="/agendar-horario" className={styles.primaryAction}>🕐 Agendar horário</Link>
            <Link to="/quadras" className={styles.secondaryAction}>🏐 Ver quadras</Link>
          </div>
        </header>

<<<<<<< HEAD
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
=======
        <div className={styles.simpleInfoGrid}>
          <section className={styles.section}><h3><FaVolleyballBall /> Sobre nós</h3><p>A Arena Beach é o espaço ideal para quem ama esportes de areia. Temos quadras de Beach Tennis e Futevôlei, torneios e estrutura completa.</p></section>
          <section className={styles.section}><h3><FaClock /> Horário</h3><p>Segunda a sexta: 08h às 21h</p><p>Sábado: 08h às 18h</p><p>Domingo: fechado</p></section>
          <section className={styles.section}><h3><FaPhoneAlt /> Contato</h3><p>(14) 99835-8654</p></section>
          <section className={styles.section}><h3><FaMapMarkerAlt /> Endereço</h3><p>Jaú, São Paulo — 17200-000</p></section>
        </div>
      </div>
    </main>
  </div>;
>>>>>>> 3f59ca753fa798eb37eb631647bd3c416b911165
}
