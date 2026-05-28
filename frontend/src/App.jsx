// componentes do React Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"



// páginas do sistema
import Gestao from "./pages/Gestao"
import Dashboard from "./pages/Dashboard"

// sidebar lateral
import Sidebar from "./components/sidebar";


function App() {

  return (

    // sistema de páginas do site
    <BrowserRouter>

      {/* sidebar lateral */}
      <Sidebar />

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