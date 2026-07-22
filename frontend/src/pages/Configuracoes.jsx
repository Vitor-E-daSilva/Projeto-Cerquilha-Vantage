import { useState } from 'react';

// Recebemos o temaAtivo e setTemaAtivo como propriedades do App.jsx
function Configuracoes({ temaAtivo, setTemaAtivo }) {
  const [mensagem, setMensagem] = useState('');

  // Lógica para esvaziar o banco
  const handleEsvaziarBanco = async () => {
    if (window.confirm("CUIDADO: Isso vai apagar todos os alunos. Tem certeza?")) {
      setMensagem("Esvaziando banco...");
      // await fetch('...', { method: 'DELETE' });
      setTimeout(() => setMensagem("Banco esvaziado com sucesso!"), 1000);
    }
  };

  // Lógica para popular o banco
  const handlePopularBanco = async () => {
    setMensagem("Inserindo dados de teste...");
    // await fetch('...', { method: 'POST' });
    setTimeout(() => setMensagem("Banco populado com sucesso!"), 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--text-h)', marginBottom: '30px' }}>Configurações</h1>

      {/* Caixa de Mensagem usando as cores do tema */}
      {mensagem && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: 'var(--accent-bg)', 
          color: 'var(--accent)', 
          border: '1px solid var(--accent-border)',
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          {mensagem}
        </div>
      )}

      {/* BOX DEV - Usando a classe "card" do index.css */}
      <section className="card" style={{ border: '2px dashed var(--accent)', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0 }}>🛠️ Área do Desenvolvedor (Dev)</h2>
        <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '20px' }}>
          Ações perigosas. Use apenas no ambiente de testes.
        </p>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleEsvaziarBanco}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#EF4444', // Mantemos vermelho fixo por ser alerta de perigo
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            🗑️ Esvaziar Banco
          </button>
          
          <button 
            onClick={handlePopularBanco}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: 'var(--accent)', // Usa a cor principal do tema
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            🧪 Popular Banco (Testes)
          </button>
        </div>
      </section>

      {/* BOX TEMAS - Totalmente Funcional */}
      <section className="card">
        <h2 style={{ marginTop: 0 }}>🎨 Aparência e Temas</h2>
        <p style={{ color: 'var(--text)', fontSize: '14px' }}>
          Escolha o esquema de cores principal do sistema.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
          
          {/* Botão Roxo Claro */}
          <button 
            title="Roxo Claro"
            onClick={() => setTemaAtivo && setTemaAtivo("roxo-claro")}
            style={{ 
              width: '50px', height: '50px', 
              backgroundColor: '#F9FAFB', 
              borderRadius: '50%', cursor: 'pointer', 
              border: temaAtivo === "roxo-claro" ? '3px solid #aa3bff' : '2px solid #e5e4e7',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{width: '20px', height: '20px', backgroundColor: '#aa3bff', borderRadius: '50%'}}></div>
          </button>

          {/* Botão Roxo Escuro */}
          <button 
            title="Roxo Escuro"
            onClick={() => setTemaAtivo && setTemaAtivo("roxo-escuro")}
            style={{ 
              width: '50px', height: '50px', 
              backgroundColor: '#111827', 
              borderRadius: '50%', cursor: 'pointer', 
              border: temaAtivo === "roxo-escuro" ? '3px solid #c084fc' : '2px solid #374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{width: '20px', height: '20px', backgroundColor: '#c084fc', borderRadius: '50%'}}></div>
          </button>

          {/* Botão Vermelho Claro */}
          <button 
            title="Vermelho Claro"
            onClick={() => setTemaAtivo && setTemaAtivo("vermelho-claro")}
            style={{ 
              width: '50px', height: '50px', 
              backgroundColor: '#FEF2F2', 
              borderRadius: '50%', cursor: 'pointer', 
              border: temaAtivo === "vermelho-claro" ? '3px solid #ef4444' : '2px solid #fecaca',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{width: '20px', height: '20px', backgroundColor: '#ef4444', borderRadius: '50%'}}></div>
          </button>

          {/* Botão Vermelho Escuro */}
          <button 
            title="Vermelho Escuro"
            onClick={() => setTemaAtivo && setTemaAtivo("vermelho-escuro")}
            style={{ 
              width: '50px', height: '50px', 
              backgroundColor: '#171717', 
              borderRadius: '50%', cursor: 'pointer', 
              border: temaAtivo === "vermelho-escuro" ? '3px solid #f87171' : '2px solid #404040',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <div style={{width: '20px', height: '20px', backgroundColor: '#f87171', borderRadius: '50%'}}></div>
          </button>

        </div>
      </section>
    </div>
  );
}

export default Configuracoes;