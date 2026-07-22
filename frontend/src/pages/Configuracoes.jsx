import { useState } from 'react';

function Configuracoes() {
  const [mensagem, setMensagem] = useState('');

  // Lógica para esvaziar o banco (Vai chamar uma rota no seu Hono futuramente)
  const handleEsvaziarBanco = async () => {
    if (window.confirm("CUIDADO: Isso vai apagar todos os alunos. Tem certeza?")) {
      setMensagem("Esvaziando banco...");
      // Aqui entrará o fetch para o backend (ex: DELETE /dev/limpar-banco)
      // await fetch('...', { method: 'DELETE' });
      setTimeout(() => setMensagem("Banco esvaziado com sucesso!"), 1000);
    }
  };

  // Lógica para popular o banco (Vai chamar uma rota no seu Hono futuramente)
  const handlePopularBanco = async () => {
    setMensagem("Inserindo dados de teste...");
    // Aqui entrará o fetch para o backend (ex: POST /dev/popular-banco)
    // await fetch('...', { method: 'POST' });
    setTimeout(() => setMensagem("Banco populado com sucesso!"), 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#4C1D95', marginBottom: '30px' }}>Configurações</h1>

      {mensagem && (
        <div style={{ padding: '10px', backgroundColor: '#e9d5ff', color: '#4C1D95', borderRadius: '5px', marginBottom: '20px' }}>
          {mensagem}
        </div>
      )}

      {/* BOX DEV (Para Testes) */}
      <section style={{ border: '2px dashed #A855F7', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0, color: '#6B7280' }}>🛠️ Área do Desenvolvedor (Dev)</h2>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
          Ações perigosas. Use apenas no ambiente de testes.
        </p>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={handleEsvaziarBanco}
            style={{ padding: '10px 15px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🗑️ Esvaziar Banco
          </button>
          
          <button 
            onClick={handlePopularBanco}
            style={{ padding: '10px 15px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🧪 Popular Banco (Testes)
          </button>
        </div>
      </section>

      {/* BOX TEMAS (Futuro) */}
      <section style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ marginTop: 0 }}>🎨 Aparência</h2>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Em breve você poderá escolher o tema de cores do sistema aqui.
        </p>
        
        {/* Futuramente você fará um select ou botões com "Tema Escuro", "Tema Roxo", etc. */}
        <div style={{ opacity: 0.5, display: 'flex', gap: '10px', marginTop: '15px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#A855F7', borderRadius: '50%' }}></div>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#1F2937', borderRadius: '50%' }}></div>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
        </div>
      </section>

    </div>
  );
}

export default Configuracoes;