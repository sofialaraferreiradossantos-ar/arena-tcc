import logo from "../assets/logo.jpeg";

function Sidebar() {
  return (
    <div className="sidebar">

      <img
        src={logo}
        alt="Logo"
        className="sidebarLogo"
      />

      <ul>
        <li>🏠 Início</li>
        <li>🌎 Quadras</li>
        <li>🗓️ Agendamentos</li>
        <li>🏆 Torneios</li>
        <li>💳 Pagamento</li>
      </ul>

    </div>
  );
}

export default Sidebar;