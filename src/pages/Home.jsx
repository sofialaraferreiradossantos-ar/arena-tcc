import styles from '../styles/home.module.css'

import Header from '../components/Header.jsx'
import CategoryButtons from '../components/CategoryButtons.jsx'
import SearchBar from '../components/Searchbar.jsx'
import QuadrasSection from '../components/QuadrasSection.jsx'
import Pagination from '../components/Pagination.jsx'


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