import styles from "../../styles/home.module.css";

import QuadraCard from "./QuadraCard";
import { nomesModalidades } from "../../mockup/dados.js";

function QuadrasSection({ quadras }) {
  return (
    <div className={styles.quadrasSection}>
      {quadras.map((quadra) => (
        <QuadraCard
          key={quadra.id}
          id={quadra.id}
          title={quadra.title}
          image={quadra.image}
          available={quadra.available}
          location={`${quadra.cidade} - ${quadra.uf}`}
          modalidade={nomesModalidades(quadra)}
          destaques={quadra.destaques}
        />
      ))}
    </div>
  );
}

export default QuadrasSection;
