import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Gestao from "./pages/Gestao"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <BrowserRouter>

      <nav>
        <Link to="/">Gestão</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Gestao />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App