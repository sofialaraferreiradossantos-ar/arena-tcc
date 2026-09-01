import { Link } from "react-router-dom";
import styles from "../../styles/home.module.css";

export default function Sobre() {
  return (
    <div className={styles.container}>
      <div className={styles.app}>

        <div className={styles.topHeader}>
          <div className={styles.logoArea}>
            <h2>
              Arena <span>Beach</span>
            </h2>
          </div>
        </div>

        <div className={`${styles.quadraCard} ${styles.sobreCard}`}>

          <header className={styles.aboutHero}>
            <span className={styles.eyebrow}>Bem-vindo</span>
            <h1 className={styles.sobreTitulo}>Arena <span>Beach</span></h1>
            <p className={styles.sobreDescricao}>
              Seu espaço para reservar quadras, participar de torneios e viver o esporte.
            </p>
          </header>

          <div className={styles.sobreSecao}>
            <h3>Sobre nós</h3>

            <p>
              A Arena Beach é um espaço ideal para quem ama
              esportes de areia. Aqui você encontra quadras
              de beach tênis, vôlei e futevôlei, além de
              eventos e uma estrutura completa para aproveitar
              com os amigos.
            </p>
          </div>

          <div className={styles.sobreSecao}>
            <h3>Horário de funcionamento</h3>

            <p>
              Segunda a sexta: 08h às 22h
              <br />
              Sábado e domingo: 08h às 18h
            </p>
          </div>

          <div className={styles.sobreSecao}>
            <h3>Suporte</h3>

            <p>(14) 99681-9354</p>
          </div>

          <div className={styles.sobreSecao}>
            <h3>Endereço</h3>

            <p>Rua Exemplo, 123 - Tupã/SP - 17600-000</p>
          </div>

          <Link
            to="/home"
            className={styles.sobreLink}
          >
            Voltar
          </Link>

        </div>

      </div>
    </div>
  );
}
