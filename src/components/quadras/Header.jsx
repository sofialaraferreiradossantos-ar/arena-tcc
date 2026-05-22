import { FaBars } from 'react-icons/fa'
import styles from "../../styles/home.module.css"
import logo from "../../assets/logo.jpeg"

function Header() {
  return (
    <div className={styles.topHeader}>

      <FaBars className={styles.menuIcon} />

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