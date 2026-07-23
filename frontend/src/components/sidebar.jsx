import { Link } from 'react-router-dom';

// Adicionada um sistema de fechar e abrir a sidebar para melhorar a UI
function Sidebar({ aberta, toggleSidebar }) {
  return (
    <>
      {/* Estilos CSS para o hover */}
      <style>
        {`
          .sidebar-link {
            transition: all 0.25s ease-in-out;
          }
          .sidebar-link:hover {
            background-color: var(--accent-bg) !important;
            color: var(--accent) !important;
            border-color: var(--accent-border) !important;
            transform: translateX(4px);
          }
        `}
      </style>

      {/* Fundo escuro transparente */}
      {aberta && (
        <div 
          onClick={toggleSidebar} 
          style={{
            position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 998,
            transition: 'all 0.3s ease'
          }}
        />
      )}

      {/* Menu Lateral, quando aberta*/}
      <aside style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        bottom: 0,
        width: '260px',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        zIndex: 999,
        padding: '24px 16px',
        boxShadow: aberta ? '10px 0 30px rgba(0, 0, 0, 0.15)' : 'none',
        transform: aberta ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s, border-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' // Empurra o conteúdo para cima e o rodapé para baixo
      }}>
        
        {/* Bloco Superior (Navegação Principal) */}
        <div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: 'var(--text)', 
            textTransform: 'uppercase', 
            letterSpacing: '1.2px', 
            marginBottom: '16px', 
            paddingLeft: '8px',
            opacity: 0.8
          }}>
            Navegação
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/" onClick={toggleSidebar} className="sidebar-link" style={estiloLink}>Gestão</Link>
            <Link to="/dashboard" onClick={toggleSidebar} className="sidebar-link" style={estiloLink}>Dashboard</Link>
            <Link to="/configuracoes" onClick={toggleSidebar} className="sidebar-link" style={estiloLink}>Configurações</Link>
          </nav>
        </div>

        {/* Bloco Inferior (Link Externo para Outros Projetos) */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: 'var(--text)', 
            textTransform: 'uppercase', 
            letterSpacing: '1.2px', 
            marginBottom: '12px', 
            paddingLeft: '8px',
            opacity: 0.8
          }}>
            Mais
          </div>

          {/* Usamos tag <a> normal pois é um link externo para o GitHub */}
          <a 
            href="https://github.com/Vitor-E-daSilva" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="sidebar-link" 
            style={estiloLink}
          >
            Outros Projetos ↗
          </a>
        </div>

      </aside>
    </>
  );
}

// Estilo base
const estiloLink = {
  textDecoration: 'none',
  color: 'var(--text-h)',
  fontWeight: '500',
  fontSize: '15px',
  padding: '10px 14px',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

export default Sidebar;