import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import Home from './pages/Home'
import Tecnicas from './pages/Tecnicas'
import TecnicaDetalhe from './pages/TecnicaDetalhe'
import Estudar from './pages/Estudar'
import EstudarResultado from './pages/EstudarResultado'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/tecnicas" element={<Tecnicas />} />
            <Route path="/tecnicas/:slug" element={<TecnicaDetalhe />} />
            <Route path="/estudar" element={<Estudar />} />
            <Route path="/estudar/resultado" element={<EstudarResultado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
