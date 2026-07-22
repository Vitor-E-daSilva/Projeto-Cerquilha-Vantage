import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/registros`;

function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]); // Lista de turmas pré-cadastradas no DB
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // Limpa as mensagens após 4 segundos
  useEffect(() => {
    if (erro || sucesso) {
      const timer = setTimeout(() => {
        setErro(null);
        setSucesso(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [erro, sucesso]);

  // --- BUSCA INICIAL DE DADOS ---
  async function buscarDados() {
    setCarregando(true);
    try {
      // Busca simultânea de alunos e das turmas cadastradas no backend
      const [respAlunos, respTurmas] = await Promise.all([
        fetch(BASE_URL),
        fetch(`${API_URL}/turmas`)
      ]);

      const dadosAlunos = await respAlunos.json();
      const dadosTurmas = await respTurmas.json();

      setAlunos(Array.isArray(dadosAlunos) ? dadosAlunos : []);
      setTurmas(Array.isArray(dadosTurmas) ? dadosTurmas : []);
    } catch (e) {
      setErro("Erro ao conectar com o servidor. Verifique se o backend está ativo.");
    } finally {
      setCarregando(false);
    }
  }

  // --- VALIDAÇÃO NO FRONTEND ---
  function validarDadosAluno(dados, idIgnorado = null) {
    if (!dados.nome || dados.nome.trim().length < 3 || dados.nome.length > 100) {
      return "Nome inválido, deve conter entre 3 e 100 caracteres.";
    }

    if (!dados.email || !dados.email.includes("@") || !dados.email.includes(".")) {
      return "E-mail inválido! Formato correto: exemplo@email.com.";
    }

    if (!dados.senha || dados.senha.length < 7) {
      return "Senha inválida, deve conter mínimo de 7 caracteres.";
    }

    const numNotebook = Number(dados.notebookId);
    if (isNaN(numNotebook) || numNotebook < 1 || numNotebook > 200) {
      return "Número do notebook inválido! Deve ser entre 1 e 200.";
    }

    // O Frontend não cria turmas, mas OBRIGA selecionar uma turma válida existente
    if (!dados.turmaId || Number(dados.turmaId) <= 0) {
      return "Selecione uma turma válida para o aluno.";
    }

    // Validações de duplicidade
    const emailDuplicado = alunos.some(
      (a) => a.email.toLowerCase() === dados.email.trim().toLowerCase() && a.id !== idIgnorado
    );
    if (emailDuplicado) return "Este e-mail já está cadastrado.";

    const notebookDuplicado = alunos.some(
      (a) => Number(a.notebookId) === numNotebook && a.id !== idIgnorado
    );
    if (notebookDuplicado) return `O notebook #${numNotebook} já está em uso por outro aluno.`;

    return null;
  }

  // --- OPERAÇÕES CRUD DE ALUNOS ---

  async function criarAluno(dadosAluno) {
    const erroValidacao = validarDadosAluno(dadosAluno);
    if (erroValidacao) {
      setErro(erroValidacao);
      return false;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAluno),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Falha ao cadastrar aluno.");
        return false;
      }

      setSucesso("Aluno cadastrado com sucesso!");
      await buscarDados();
      return true;
    } catch (e) {
      setErro("Erro ao cadastrar aluno.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function editarAluno(id, dadosAluno) {
    const erroValidacao = validarDadosAluno(dadosAluno, id);
    if (erroValidacao) {
      setErro(erroValidacao);
      return false;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAluno),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Falha ao atualizar aluno.");
        return false;
      }

      setSucesso("Aluno atualizado com sucesso!");
      await buscarDados();
      return true;
    } catch (e) {
      setErro("Erro ao editar aluno.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function deletarAluno(id) {
    setCarregando(true);
    try {
      const resposta = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Falha ao excluir aluno.");
        return false;
      }

      setSucesso("Aluno excluído com sucesso!");
      await buscarDados();
      return true;
    } catch (e) {
      setErro("Erro ao excluir aluno.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  // --- ROTA DE CONFIGURAÇÕES / DEV TOOLS ---

  async function esvaziarBanco() {
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/dev/limpar`, { method: "DELETE" });
      if (!resposta.ok) throw new Error();
      setSucesso("Banco de dados esvaziado!");
      await buscarDados();
      return true;
    } catch (e) {
      setErro("Erro ao esvaziar banco de dados.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  async function popularBanco() {
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/dev/seed`, { method: "POST" });
      if (!resposta.ok) throw new Error();
      setSucesso("Dados de teste e turmas populados!");
      await buscarDados();
      return true;
    } catch (e) {
      setErro("Erro ao popular banco de dados.");
      return false;
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarDados();
  }, []);

  // --- LÓGICA E MÉTRICAS PARA OS GRÁFICOS DO DASHBOARD ---
  const totalAlunos = alunos.length;
  const limiteNotebooks = 200;
  const notebooksEmUso = new Set(alunos.map(a => Number(a.notebookId))).size;
  const notebooksDisponiveis = Math.max(0, limiteNotebooks - notebooksEmUso);
  const taxaOcupacao = Math.round((notebooksEmUso / limiteNotebooks) * 100);

  // 1. Métricas por Turno (Ideal para Gráfico de Rosca / Pizza)
  const alunosPorTurno = alunos.reduce((acc, aluno) => {
    // Puxa o turno através do relacionamento com a turma do aluno
    const turno = aluno.turma_turno || aluno.turno || "Não Informado";
    acc[turno] = (acc[turno] || 0) + 1;
    return acc;
  }, {});

  // 2. Métricas por Turma (Ideal para Gráfico de Barras)
  const alunosPorTurma = turmas.map(turma => {
    const totalNaTurma = alunos.filter(a => Number(a.turmaId) === Number(turma.id)).length;
    return {
      id: turma.id,
      nome: turma.nome,
      turno: turma.turno,
      totalAlunos: totalNaTurma
    };
  });

  return {
    alunos,
    turmas, // Exponibilizada para preencher o <select> no formulário de Cadastro
    carregando,
    erro,
    sucesso,
    metricas: {
      totalAlunos,
      notebooksEmUso,
      notebooksDisponiveis,
      taxaOcupacao,
      limiteNotebooks,
      alunosPorTurno, // Ex: { Manhã: 12, Tarde: 8, Noite: 15 }
      alunosPorTurma  // Ex: [ { nome: "Turma A", turno: "Manhã", totalAlunos: 12 }, ... ]
    },
    validarDadosAluno,
    buscarDados,
    criarAluno,
    editarAluno,
    deletarAluno,
    esvaziarBanco,
    popularBanco
  };
}

export default useAlunos;