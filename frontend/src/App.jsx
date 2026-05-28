import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// páginas do sistema
import Gestao from "./pages/Gestao"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
//sistema de paginas no site
    <BrowserRouter>

      {/* navbar principal */}
      <nav className="navbar">

        {/* logo */}
        <div className="logo">

          {/* símbolo */}
          <span className="logo-symbol">
            #
          </span>

          {/* nome */}
          <span className="logo-text">
            CERQUILHA
          </span>

        </div>

        {/* links de navegação */}
        <div className="nav-links">

          {/* abre a rota principal */}
          <Link to="/">
            Gestão
          </Link>

          {/* abre a rota dashboard */}
          <Link to="/dashboard">
            Dashboard
          </Link>

        </div>

      </nav>

      {/* container das rotas */}
      <Routes>

        {/* rota principal */}
        <Route
          path="/"
          element={<Gestao />}
        />

        {/* rota dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>

  )
}

export default App


/*
REACT ROUTER

O React Router foi usado pra criar a navegação entre as páginas do sistema.

Rotas atuais:

"/"
abre Gestão

"/dashboard"
abre Dashboard

BrowserRouter
ativa o sistema de rotas

Routes
agrupa todas as rotas

Route
- define:
URL
componente renderizado

Link
- usado pra navegar entre páginas
- funciona sem recarregar o site

Quando o usuário clica em um Link,
o React Router renderiza somente
o componente necessário.

Isso deixou a navegação:
- mais rápida
- mais organizada
- mais fluida

*/