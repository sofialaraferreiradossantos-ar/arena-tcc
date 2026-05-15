import { FaBars } from 'react-icons/fa'

import styles from '../styles/home.module.css'
import logo from '.'
function Header() {
  return (
    <div className={styles.topHeader}>

      <FaBars className={styles.menuIcon} />

      <div className={styles.logoArea}>

        <img
          src="https://i.imgur.com/eJw8m8x.png"
          alt="logo"
        />

        <h2>
          Nossas <span>Quadras</span>
        </h2>

      </div>

    </div>
  )
}

export default Header