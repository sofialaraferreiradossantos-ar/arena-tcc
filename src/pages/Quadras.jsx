import { useState } from 'react'

import styles from '../styles/home.module.css'

import Header from '../components/quadras/Header'
import CategoryButtons from '../components/quadras/CategoryButtons'
import SearchBar from '../components/quadras/SearchBar'
import QuadrasSection from '../components/quadras/QuadrasSection'
import Pagination from '../components/quadras/Pagination'

import quadra1 from '../assets/quadra1.jpg'
import quadra2 from '../assets/quadra2.jpg'
import quadra3 from '../assets/quadra3.jpg'

function Quadras() {

  const [search, setSearch] = useState('')

  const [category, setCategory] = useState('Todos')

  const [currentPage, setCurrentPage] = useState(0)

  const quadras = [
    {
      id: 1,
      title: 'Quadra 1',
      type: 'Beach Tennis',
      image: quadra1,
      available: true
    },

    {
      id: 2,
      title: 'Quadra 2',
      type: 'Futevôlei',
      image: quadra2,
      available: false
    },

    {
      id: 3,
      title: 'Quadra 3',
      type: 'Beach Tennis',
      image: quadra3,
      available: true
    }
  ]

  const filteredQuadras = quadras.filter((quadra) => {

    const matchesSearch =
      quadra.title.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'Todos' ||
      quadra.type === category

    return matchesSearch && matchesCategory
  })

  const cardsPerPage = 3

  const startIndex = currentPage * cardsPerPage

  const selectedQuadras =
    filteredQuadras.slice(
      startIndex,
      startIndex + cardsPerPage
    )

  return (
    <div className={styles.container}>

      <div className={styles.app}>

        <Header />

        <CategoryButtons
          category={category}
          setCategory={setCategory}
        />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <QuadrasSection quadras={selectedQuadras} />

        <Pagination
          total={Math.ceil(filteredQuadras.length / cardsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

      </div>

    </div>
  )
}

export default Quadras