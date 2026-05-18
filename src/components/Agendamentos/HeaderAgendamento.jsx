import { FaBars } from 'react-icons/fa'
import { FaRegUserCircle } from 'react-icons/fa'

import styles from '../../styles/agendamentos.module.css'

import logo from '../../assets/logo.png'

function HeaderAgendamento() {
  return (
    <div className={styles.header}>

      <FaBars className={styles.menuIcon} />

      <div className={styles.centerArea}>

        <img src={logo} alt="" />

        <h1>
          Meus <span>Agendamentos</span>
        </h1>

      </div>

      <FaRegUserCircle className={styles.userIcon} />

    </div>
  )
}

export default HeaderAgendamento