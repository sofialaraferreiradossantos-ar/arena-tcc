import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AgendamentoSucesso from './pages/AgendamentoSucesso.jsx'
import Agendamentos from './pages/Agendamentos.jsx'
import Cadastro from './components/quadras/Cadastro.jsx'
import Home from './components/quadras/Home.jsx'
import Login from './components/quadras/Login.jsx'
import Sobre from './components/quadras/sobre.jsx'
import Torneios from './pages/Torneios.jsx' 
import InscricaoTorneio from './pages/InscricaoTorneio.jsx'
import Pagamento from './pages/pagamento.jsx'
import PagamentoCartao from './pages/pagamentoCartao.jsx'
import RecuperarSenha from "./components/quadras/recuperarSenha.jsx";
import TorneioDetalhes from "./pages/TorneioDetalhes";
import Quadras from "./pages/Home.jsx";



import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import QuadraDetalhes from './pages/QuadraDetalhes.jsx'
import Administrador from './pages/Administrador.jsx'
import AdminModulo from './pages/AdminModulo.jsx'
import AgendarHorario from './pages/AgendarHorario.jsx'
import UnifiedMenu from './components/UnifiedMenu.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<UnifiedMenu />
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/quadra" element={<QuadraDetalhes />} />
  <Route path="/sucesso" element={<AgendamentoSucesso />} />
  <Route path="/agendamentos" element={<Agendamentos />} />
  <Route path="/cadastro" element={<Cadastro />} />
  <Route path="/home" element={<Home />} />
  <Route path="/quadras" element={<Quadras />} />
  <Route path="/login" element={<Login />} />
  <Route path="/sobre" element={<Sobre />} />
  <Route path="/torneios" element={<Torneios />} />
  <Route path="/inscricao/:id" element={<InscricaoTorneio />} />
  <Route path="/pagamento" element={<Pagamento />} />
  <Route path="/pagamentoCartao" element={<PagamentoCartao />} />
  <Route path="/recuperarSenha" element={<RecuperarSenha />} />
  <Route path="/torneio/:id" element={<TorneioDetalhes />} />
  <Route path="/administrador" element={<Administrador />} />
  <Route path="/administrador/:modulo" element={<AdminModulo />} />
  <Route path="/agendar-horario" element={<AgendarHorario />} />

</Routes>
    </BrowserRouter>
  </StrictMode>,
)
