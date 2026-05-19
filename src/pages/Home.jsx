import styles from '../styles/home.module.css'

import Header from '../components/quadra/Header.jsx'
import CategoryButtons from '../components/quadra/CategoryButtons.jsx'
import SearchBar from '../components/SearchBar.jsx'
import QuadrasSection from '../components/quadra/QuadrasSection.jsx'
import Pagination from '../components/quadra/Pagination.jsx'


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