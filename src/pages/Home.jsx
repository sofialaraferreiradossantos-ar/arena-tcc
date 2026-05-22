import styles from '../styles/home.module.css'

import Header from '../components/quadras/Header.jsx'
import CategoryButtons from '../components/quadras/CategoryButtons.jsx'
import SearchBar from '../components/quadras/SearchBar.jsx'
import QuadrasSection from '../components/quadras/QuadrasSection.jsx'
import Pagination from '../components/quadras/Pagination.jsx'

import { quadrasMckp } from '../mockup/dados.js';
const [pagina, setPagina] = useState(1);

function Home() {
  return (
    <div className={styles.container}>

      <div className={styles.app}>

        <Header />

        <CategoryButtons />

        <SearchBar />

        <QuadrasSection quadras={quadrasMckp} />

     <Pagination
  pagina={pagina}
  setPagina={setPagina}
/>

      </div>

    </div>
  )
}

export default Home