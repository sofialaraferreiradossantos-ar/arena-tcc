import { FaSearch } from 'react-icons/fa'
import { FaChevronDown } from 'react-icons/fa'

import styles from '../styles/home.module.css'

function SearchBar() {
  return (
    <div className={styles.searchBar}>

      <FaSearch className={styles.searchIcon} />

      <input
        type="text"
        placeholder="Pesquisar Quadras..."
      />

      <FaChevronDown className={styles.arrowIcon} 
      
      />

    </div>
  )
}

export default SearchBar