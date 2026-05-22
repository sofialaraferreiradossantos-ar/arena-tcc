import styles from '../styles/home.module.css'

import Header from '../components/quadras/Header.jsx'
import CategoryButtons from '../components/quadras/CategoryButtons.jsx'
import SearchBar from '../components/quadras/SearchBar.jsx'
import QuadrasSection from '../components/quadras/QuadrasSection.jsx'
import Pagination from '../components/quadras/Pagination.jsx'


function Home() {
  return (
    <div className={styles.container}>

      <div className={styles.app}>

        <Header />

        <CategoryButtons />

        <SearchBar />

        <QuadrasSection />

        <Pagination />

      </div>

    </div>
  )
}

export default Home