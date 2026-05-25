import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app">

      <Sidebar />

      <div className="mainContent">
        <Home />
      </div>

    </div>
  );
}

export default App;