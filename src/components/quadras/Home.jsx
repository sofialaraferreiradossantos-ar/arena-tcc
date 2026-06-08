import styles from "../../styles/home.module.css";

export default function Home() {
  return (
    <div className={styles.arenaWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>◉</div>

          <div className={styles.logoText}>
            <span>ARENA</span>
            <span>BEACH</span>
          </div>
        </div>

        <nav className={styles.menu}>
          <button className={`${styles.menuItem} ${styles.active}`}>
            🏠 <span>Início</span>
          </button>

          <button className={styles.menuItem}>
            🏐 <span>Quadras</span>
          </button>

          <button className={styles.menuItem}>
            📅 <span>Agendamentos</span>
          </button>

          <button className={styles.menuItem}>
            🏆 <span>Torneios</span>
          </button>

          <button className={styles.menuItem}>
            💳 <span>Pagamento</span>
          </button>

          <button className={styles.menuItem}>
            🚪 <span>Sair</span>
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
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
            <h3>Sobre nós</h3>

            <p>
              A Arena Beach é o espaço ideal para quem ama esportes
              de areia. Aqui você encontra quadras de Beach Tennis,
              vôlei e futebol, além de torneios e uma estrutura
              completa para aproveitar com os amigos.
            </p>
          </section>

          <section className={styles.section}>
            <h3>Horário de funcionamento</h3>

            <p>Segunda à sexta-feira: 08:00 / 21:00</p>
            <p>Sábado: 08:00 / 18:00</p>
            <p>Domingo: Fechado</p>

            <small>
              Os horários podem sofrer alterações em feriados locais
              e nacionais.
            </small>
          </section>

          <section className={styles.section}>
            <h3>Suporte</h3>

            <div className={styles.inlineInfo}>
              📞 <span>(14) 99835-8654</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Endereço</h3>

            <p>Rua xxxxxxxx - Jaú/SP, 17200-000</p>
          </section>
        </div>
      </main>
    </div>
  );
}