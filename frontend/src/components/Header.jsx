function Header({ toggleSidebar, temaAtivo, setTemaAtivo }) {
  
  // Função para alternar o tema do claro para o escuro
  const alternarTema = () => {
    if (temaAtivo === "roxo-claro") setTemaAtivo("roxo-escuro");
    else if (temaAtivo === "roxo-escuro") setTemaAtivo("roxo-claro");
    else if (temaAtivo === "vermelho-claro") setTemaAtivo("vermelho-escuro");
    else if (temaAtivo === "vermelho-escuro") setTemaAtivo("vermelho-claro");
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px',
      backgroundColor: 'var(--surface)', // <- Variável de Fundo
      borderBottom: '1px solid var(--border)', // <- Variável de Borda
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'background-color 0.3s, border-color 0.3s'
    }}>
      
      {/* Botão da Cerquilha */}
      <button 
        onClick={toggleSidebar}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--accent)', // <- Variável da Cor Principal
          fontSize: '28px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          transition: 'color 0.3s'
        }}
      >
        #
      </button>

      {/* Título Central */}
      <h2 style={{ 
        margin: 0, 
        fontSize: '20px', 
        letterSpacing: '1px',
        color: 'var(--accent)'
      }}>
        Cerquilha Vantage
      </h2>

      {/* Botão de Alternar Tema (Claro/Escuro) */}
      <button 
        onClick={alternarTema}
        title="Mudar Tema"
        style={{ 
          background: 'var(--code-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          fontSize: '18px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s'
        }}
      >
        {temaAtivo.includes('escuro') ? '☀️' : '🌑'}
      </button>

    </header>
  );
}

export default Header;