import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AgendamentoSucesso from './pages/AgendamentoSucesso.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Cadastro from './components/quadras/Cadastro.jsx'

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import App from './App.jsx'
import QuadraDetalhes from './pages/QuadraDetalhes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<Routes>
  <Route path="/" element={<App />} />
  <Route path="/quadra" element={<QuadraDetalhes />} />
  <Route path="/sucesso" element={<AgendamentoSucesso />} />
   <Route path="/agendamentos" element={<Agendamentos />} /> 
  <Route path="/cadastro" element={<Cadastro />} />
</Routes>
    </BrowserRouter>
  </StrictMode>,
)