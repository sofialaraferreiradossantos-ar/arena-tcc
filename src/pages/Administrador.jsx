import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Administrador from "./pages/Administrador";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/administrador"
        element={<Administrador />}
      />

    </Routes>
  );
}

export default App;