import { useState, useEffect } from 'react';
import useAlunos from '../../hooks/useAlunos';
import styles from './Configuracoes.module.css';

function Configuracoes({ temaAtivo, setTemaAtivo }) {
  const [mensagemLocal, setMensagemLocal] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('sucesso'); // 'sucesso' ou 'erro'
  const { esvaziarBanco, popularBanco, carregando, erro, sucesso } = useAlunos();

  // Captura erros ou sucessos vindos do hook
  useEffect(() => {
    if (erro) {
      setMensagemLocal(erro);
      setTipoMensagem('erro');
    } else if (sucesso) {
      setMensagemLocal(sucesso);
      setTipoMensagem('sucesso');
    }
  }, [erro, sucesso]);

  // Cronômetro de 4 segundos para apagar a mensagem temporária automaticamente
  useEffect(() => {
    if (mensagemLocal) {
      const timer = setTimeout(() => {
        setMensagemLocal('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [mensagemLocal]);

  // Executa o esvaziamento do banco
  const handleEsvaziarBanco = async () => {
    if (window.confirm("ATENÇÃO: Esta ação removerá permanentemente todos os registros de alunos. Deseja continuar?")) {
      const ok = await esvaziarBanco();
      if (ok) {
        setTipoMensagem('sucesso');
        setMensagemLocal("Banco de dados esvaziado com sucesso.");
      }
    }
  };

  // Executa o povoamento do banco
  const handlePopularBanco = async () => {
    const ok = await popularBanco();
    if (ok) {
      setTipoMensagem('sucesso');
      setMensagemLocal("Dados de teste e turmas populados com sucesso.");
    }
  };

  // Lista dos temas disponíveis
  const opcoesTemas = [
    { id: 'roxo-claro', nome: 'Vantage-White', corFundo: '#F9FAFB', corDestaque: '#aa3bff' },
    { id: 'roxo-escuro', nome: 'Vantage-Dark', corFundo: '#111827', corDestaque: '#c084fc' },
    { id: 'vermelho-claro', nome: 'Velvet-White', corFundo: '#FEF2F2', corDestaque: '#ef4444' },
    { id: 'vermelho-escuro', nome: 'Velvet-Dark', corFundo: '#171717', corDestaque: '#f87171' }
  ];

  return (
    <div className={styles.configContainer}>

      {/* Cabeçalho da Página */}
      <header className={styles.header}>
        <h1>Configurações</h1>
        <p>Gerenciamento de preferências do sistema e ferramentas de ambiente.</p>
      </header>

      {/* APARÊNCIA E TEMAS */}
      <section className="card">
        <div className={styles.sectionHeader}>
          <h2>Aparência do Sistema</h2>
          <p>Selecione o esquema cromático para a interface de navegação.</p>
        </div>

        {/* Grid de Seleção de Temas */}
        <div className={styles.temasGrid}>
          {opcoesTemas.map((tema) => {
            const isSelecionado = temaAtivo === tema.id;
            return (
              <button
                key={tema.id}
                className={`${styles.cardTema} ${isSelecionado ? styles.cardTemaSelecionado : ''}`}
                onClick={() => setTemaAtivo && setTemaAtivo(tema.id)}
              >
                {/* Amostra Visual da Cor */}
                <div
                  className={styles.amostraCor}
                  style={{
                    backgroundColor: tema.corFundo,
                    border: `2px solid ${tema.corDestaque}`
                  }}
                />

                {/* Nome do Tema */}
                <span className={`${styles.nomeTema} ${isSelecionado ? styles.nomeTemaSelecionado : ''}`}>
                  {tema.nome}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Banner de Mensagem Temporária (com variante de erro e sucesso) */}
      {mensagemLocal && (
        <div className={`${styles.feedbackBanner} ${tipoMensagem === 'erro' ? styles.bannerErro : styles.bannerSucesso}`}>
          {mensagemLocal}
        </div>
      )}

      {/* ÁREA DE DESENVOLVIMENTO */}
      <section className={`card ${styles.devSection}`}>
        <div className={styles.sectionHeader}>
          <h2>Ferramentas de Desenvolvimento</h2>
          <p>Ações de depuração e manipulação direta da base de dados local.</p>
        </div>

        <div className={styles.devActions}>
          <button
            onClick={handlePopularBanco}
            disabled={carregando}
            className={`${styles.btnDev} ${styles.btnPrimary}`}
          >
            {carregando ? "Processando..." : "Popular Banco de Dados"}
          </button>

          <button
            onClick={handleEsvaziarBanco}
            disabled={carregando}
            className={`${styles.btnDev} ${styles.btnDangerOutline}`}
          >
            {carregando ? "Processando..." : "Esvaziar Banco de Dados"}
          </button>
        </div>
      </section>

    </div>
  );
}

export default Configuracoes;