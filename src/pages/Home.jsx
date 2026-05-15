import styles from '../styles/home.module.css'

import Header from '../components/Header'
import CategoryButtons from '../components/CategoryButtons'
import SearchBar from '../components/SearchBar'
import QuadrasSection from '../components/QuadrasSection'
import Pagination from '../components/Pagination'

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