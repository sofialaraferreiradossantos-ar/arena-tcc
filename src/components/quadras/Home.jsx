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

        <div className={styles.simpleInfoGrid}>
          <section className={styles.section}><h3><FaVolleyballBall /> Sobre nós</h3><p>A Arena Beach é o espaço ideal para quem ama esportes de areia. Temos quadras de Beach Tennis e Futevôlei, torneios e estrutura completa.</p></section>
          <section className={styles.section}><h3><FaClock /> Horário</h3><p>Segunda a sexta: 08h às 21h</p><p>Sábado: 08h às 18h</p><p>Domingo: fechado</p></section>
          <section className={styles.section}><h3><FaPhoneAlt /> Contato</h3><p>(14) 99835-8654</p></section>
          <section className={styles.section}><h3><FaMapMarkerAlt /> Endereço</h3><p>Jaú, São Paulo — 17200-000</p></section>
        </div>
      </div>
    </main>
  </div>;
}
