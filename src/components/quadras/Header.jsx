import { FaBars } from 'react-icons/fa'
import { useState } from 'react'

import styles from '../../styles/home.module.css'
import logo from '../../assets/logo.jpeg'

function Header() {

  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className={styles.topHeader}>

      <FaBars
        className={styles.menuIcon}
        onClick={() => setMenuAberto(!menuAberto)}
      />



{menuAberto && (
  <div className={styles.sidebarMenu}>

    <button
      className={styles.closeMenu}
      onClick={() => setMenuAberto(false)}
    >
      
    </button>

    <img src={logo} alt="" />

    <a href="">🏠 Início</a>
    <a href="">⚽ Quadras</a>
    <a href="">📅 Agendamentos</a>
    <a href="">🏆 Torneios</a>
    <a href="">💳 Pagamento</a>

  </div>
)}

      <div className={styles.logoArea}>

        <img
          src={logo}
          alt=""
        />

        <h2>
          Nossas <span>Quadras</span>
        </h2>

      </div>

    </div>
  )
}

export default Header