import "./administrador.module.css";

import {
  FiUsers,
  FiGrid,
  FiCalendar,
  FiAward,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu
} from "react-icons/fi";

function Administrador() {

  return (

<div className="admin">

<div className="topo">

<img
src="/logo.png"
alt="logo"
/>

<FiMenu className="menu"/>

</div>

<h1>Olá, Administrador!</h1>

<p>Gerencie as informações do sistema.</p>

<div className="cards">

<div className="card">
<FiUsers/>
<h2>Usuários</h2>
<p>Gerenciar usuários</p>
</div>

<div className="card">
<FiGrid/>
<h2>Quadras</h2>
<p>Gerenciar quadras</p>
</div>

<div className="card">
<FiCalendar/>
<h2>Agendamentos</h2>
<p>Gerenciar reservas</p>
</div>

<div className="card">
<FiAward/>
<h2>Torneios</h2>
<p>Gerenciar torneios</p>
</div>

<div className="card">
<FiBarChart2/>
<h2>Relatórios</h2>
<p>Visualizar dados</p>
</div>

<div className="card">
<FiSettings/>
<h2>Configurações</h2>
<p>Configurações gerais</p>
</div>

</div>

<button className="sair">

<FiLogOut/>

Sair do sistema

</button>

</div>

  )

}

export default Administrador;