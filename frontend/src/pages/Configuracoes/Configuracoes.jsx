import { useState } from 'react';

function Configuracoes({ temaAtivo, setTemaAtivo }) {
  const [mensagem, setMensagem] = useState('');

  // Lógica para esvaziar o banco
  const handleEsvaziarBanco = async () => {
    if (window.confirm("ATENÇÃO: Esta ação removerá permanentemente todos os registros de alunos. Deseja continuar?")) {
      setMensagem("Processando: Esvaziando banco de dados...");
      // await fetch('...', { method: 'DELETE' });
      setTimeout(() => setMensagem("Banco de dados esvaziado com sucesso."), 1200);
    }
  };

  // Lógica para popular o banco
  const handlePopularBanco = async () => {
    setMensagem("Processando: Inserindo dados de teste...");
    // await fetch('...', { method: 'POST' });
    setTimeout(() => setMensagem("Dados de teste inseridos com sucesso."), 1200);
  };

  // Definição dos temas disponíveis para renderização limpa
  const opcoesTemas = [
    { id: 'roxo-claro', nome: 'Roxo Claro', corFundo: '#F9FAFB', corDestaque: '#aa3bff', borda: '#e5e4e7' },
    { id: 'roxo-escuro', nome: 'Roxo Escuro', corFundo: '#111827', corDestaque: '#c084fc', borda: '#374151' },
    { id: 'vermelho-claro', nome: 'Vermelho Claro', corFundo: '#FEF2F2', corDestaque: '#ef4444', borda: '#fecaca' },
    { id: 'vermelho-escuro', nome: 'Vermelho Escuro', corFundo: '#171717', corDestaque: '#f87171', borda: '#404040' }
  ];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* CSS Injetado para microinterações e hover de botões */}
      <style>
        {`
          .btn-dev {
            transition: all 0.2s ease;
          }
          .btn-dev:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .card-tema {
            transition: all 0.2s ease;
          }
          .card-tema:hover {
            border-color: var(--accent) !important;
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* Cabeçalho da Página */}
      <header>
        <h1 style={{ marginBottom: '8px' }}>Configurações</h1>
        <p style={{ color: 'var(--text)', fontSize: '15px' }}>
          Gerenciamento de preferências do sistema e ferramentas de ambiente.
        </p>
      </header>

      {/* Feedback de Ação */}
      {mensagem && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: 'var(--accent-bg)', 
          color: 'var(--text-h)', 
          border: '1px solid var(--accent-border)',
          borderRadius: '6px', 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {mensagem}
        </div>
      )}

      {/* SEÇÃO 1: APARÊNCIA E TEMAS */}
      <section className="card">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Aparência do Sistema</h2>
          <p style={{ color: 'var(--text)', fontSize: '14px' }}>
            Selecione o esquema cromático para a interface de navegação.
          </p>
        </div>
        
        {/* Grid de Seleção de Temas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '12px' 
        }}>
          {opcoesTemas.map((tema) => {
            const isSelecionado = temaAtivo === tema.id;
            return (
              <button
                key={tema.id}
                className="card-tema"
                onClick={() => setTemaAtivo && setTemaAtivo(tema.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg)',
                  border: isSelecionado ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {/* Amostra Visual da Cor */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: tema.corFundo,
                  border: `2px solid ${tema.corDestaque}`,
                  boxSizing: 'border-box',
                  flexShrink: 0
                }} />

                {/* Nome do Tema */}
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: isSelecionado ? '600' : '400',
                  color: isSelecionado ? 'var(--accent)' : 'var(--text-h)'
                }}>
                  {tema.nome}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO 2: ÁREA DE DESENVOLVIMENTO */}
      <section className="card" style={{ borderStyle: 'dashed' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-h)' }}>
            Ferramentas de Desenvolvimento
          </h2>
          <p style={{ color: 'var(--text)', fontSize: '14px' }}>
            Ações de depuração e manipulação direta da base de dados local.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={handlePopularBanco}
            className="btn-dev"
            style={{ 
              padding: '10px 18px', 
              backgroundColor: 'var(--accent)', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer' 
            }}
          >
            Popular Banco de Dados
          </button>

          <button 
            onClick={handleEsvaziarBanco}
            className="btn-dev"
            style={{ 
              padding: '10px 18px', 
              backgroundColor: 'transparent', 
              color: '#EF4444', 
              border: '1px solid #EF4444', 
              borderRadius: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer' 
            }}
          >
            Esvaziar Banco de Dados
          </button>
        </div>
      </section>

    </div>
  );
}

export default Configuracoes;