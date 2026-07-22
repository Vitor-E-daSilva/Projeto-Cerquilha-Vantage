// componentes do React Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

// componentes do react padrão (Adicionamos o useEffect)
import { useState, useEffect } from "react";

// páginas do sistema
import Gestao from "./pages/Gestao"
import Dashboard from "./pages/Dashboard"
import Configuracoes from "./pages/Configuracoes"

// sidebar lateral e header
import Sidebar from "./components/sidebar";
import Header from "./components/Header"


function App() {
  // Estado que controla se a sidebar está visível
  const [sidebarAberta, setSidebarAberta] = useState(false);

  // ESTADO DO TEMA: Puxa o salvo no navegador ou usa 'roxo-claro' por padrão
  const temaSalvo = localStorage.getItem("v-vault-tema") || "roxo-claro";
  const [temaAtivo, setTemaAtivo] = useState(temaSalvo);

  // EFEITO DO TEMA: Atualiza o HTML e salva no navegador quando o tema mudar
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", temaAtivo);
    localStorage.setItem("v-vault-tema", temaAtivo);
  }, [temaAtivo]);

  // Função que inverte o estado da sidebar
  const toggleSidebar = () => {
    setSidebarAberta(!sidebarAberta);
  };

  return (
    // sistema de páginas do site
    <BrowserRouter>

      {/* header do sistema */}
      <Header 
        toggleSidebar={toggleSidebar} 
        temaAtivo={temaAtivo} 
        setTemaAtivo={setTemaAtivo} 
      />

      {/* sidebar lateral */}
      <Sidebar 
        aberta={sidebarAberta} 
        toggleSidebar={toggleSidebar}
      />

      {/* container das rotas */}
      <main style={{ 
        marginTop: '60px', // Compensa a altura do Header fixo
        padding: '20px', 
        minHeight: 'calc(100svh - 60px)', 
        // A cor de fundo não fica mais aqui, o CSS faz isso pelo tema!
      }}>
        
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

          {/* rota configuracoes */}
          <Route
            path="/configuracoes"
            element={<Configuracoes temaAtivo={temaAtivo} setTemaAtivo={setTemaAtivo}/>}
          />
        </Routes>
        
      </main>

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