import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/registros`;

function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]); 
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [metricas, setMetricas] = useState(null); // Nova constante para melhorar funcionamento dos gráficos no dashboard

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

  async function buscarDados() {
    setCarregando(true);
    try {
      const [respAlunos, respTurmas, respMetricas] = await Promise.all([
        fetch(BASE_URL),
        fetch(`${API_URL}/turmas`),
        fetch(`${API_URL}/metricas`)
      ]);

      const dadosAlunos = await respAlunos.json();
      const dadosTurmas = await respTurmas.json();
      const dadosMetricas = await respMetricas.json();

      // Checa a estrutura dos dados e injeta eles nas constantes
      setAlunos(Array.isArray(dadosAlunos) ? dadosAlunos : []);
      setTurmas(Array.isArray(dadosTurmas) ? dadosTurmas : []);
      if (!dadosMetricas.erro) {
        setMetricas(dadosMetricas);
      }

    } catch (e) {
      setErro("Erro ao conectar com o servidor. Verifique se o backend está ativo.");
    } finally {
      setCarregando(false);
    }
  }

  // Validações do frontend
  function validarDadosAluno(dados, idIgnorado = null) {
    if (!dados.nome || dados.nome.trim().length < 3 || dados.nome.length > 100) {
      return "Nome inválido, deve conter entre 3 e 100 caracteres.";
    }
    if (!dados.email || !dados.email.includes("@") || !dados.email.includes(".") || dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
      return "E-mail inválido! Formato correto: exemplo@email.com.";
    }
    if (!dados.senha || dados.senha.length < 7) {
      return "Senha inválida, deve conter mínimo de 7 caracteres.";
    }
    const numNotebook = Number(dados.notebookId);
    if (isNaN(numNotebook) || numNotebook < 1 || numNotebook > 200) {
      return "Número do notebook inválido! Deve ser entre 1 e 200.";
    }
    if (!dados.turmaId || Number(dados.turmaId) <= 0) {
      return "Selecione uma turma válida para o aluno.";
    }
    //Faz a checagem de duplicidade usando some(), faz mais de uma checagem e retorna true se alguma delas for true
    
    // Checagem de email duplicado
    const emailDuplicado = alunos.some(
      (a) => a.email.toLowerCase() === dados.email.trim().toLowerCase() && a.id !== idIgnorado
    );
    if (emailDuplicado) return "Este e-mail já está cadastrado.";

    // Checagem de notebook em uso
    const notebookDuplicado = alunos.some(
      (a) => Number(a.notebookId) === numNotebook && a.id !== idIgnorado
    );
    if (notebookDuplicado) return `O notebook #${numNotebook} já está em uso por outro aluno.`;

    return null;
  }

  // Função para mandar os alunos para o banco
  async function criarAluno(dadosAluno) {
    const erroValidacao = validarDadosAluno(dadosAluno); // Chama as validações
    if (erroValidacao) { setErro(erroValidacao); return false; } // Retorna se a validação estiver errado
    setCarregando(true); // Diz ao sistema que a solicitação está em progresso
    try {
      const resposta = await fetch(BASE_URL, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dadosAluno),
      }); // Envia para o servidor
      const dados = await resposta.json(); // Pega resposta do servidor
      // Procedimentos padrão de finalização do processo ↓
      if (!resposta.ok) { setErro(dados.erro || "Falha ao cadastrar aluno."); return false; }
      setSucesso("Aluno cadastrado com sucesso!");
      await buscarDados();
      return true;
    } catch (e) { setErro("Erro ao cadastrar aluno."); return false; } finally { setCarregando(false); }
  }

  // Função para editar alunos
  async function editarAluno(id, dadosAluno) {
    // Validações simples com o mesmo sistema de criarAluno()
    const erroValidacao = validarDadosAluno(dadosAluno, id);
    if (erroValidacao) { setErro(erroValidacao); return false; }
    setCarregando(true);
    try {
      const resposta = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dadosAluno),
      });
      const dados = await resposta.json();
      if (!resposta.ok) { setErro(dados.erro || "Falha ao atualizar aluno."); return false; }
      setSucesso("Aluno atualizado com sucesso!");
      await buscarDados();
      return true;
    } catch (e) { setErro("Erro ao editar aluno."); return false; } finally { setCarregando(false); }
  }

  // Função para deletar alunos
  async function deletarAluno(id) {
    // Envia uma solicitação para o servidor deletar o aluno, passsando o id
    setCarregando(true);
    try {
      const resposta = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      const dados = await resposta.json();
      if (!resposta.ok) { setErro(dados.erro || "Falha ao excluir aluno."); return false; }
      setSucesso("Aluno excluído com sucesso!");
      await buscarDados();
      return true;
    } catch (e) { setErro("Erro ao excluir aluno."); return false; } finally { setCarregando(false); }
  }

  // Função para uso no menu de configurações
  async function esvaziarBanco() {
    // Chama uma rota especifica do servidor para deletar todos os alunos
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/dev/limpar`, { method: "DELETE" });
      if (!resposta.ok) throw new Error();
      setSucesso("Banco de dados esvaziado!");
      await buscarDados();
      return true;
    } catch (e) { setErro("Erro ao esvaziar banco de dados."); return false; } finally { setCarregando(false); }
  }

  // Função para popular o banco
  async function popularBanco() {
    // Chama outra rota do servidor para popular o banco com alunos base
    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}/dev/seed`, { method: "POST" });
      if (!resposta.ok) throw new Error();
      setSucesso("Dados de teste e turmas populados!");
      await buscarDados();
      return true;
    } catch (e) { setErro("Erro ao popular banco de dados."); return false; } finally { setCarregando(false); }
  }

  // useEffect padrão do React
  useEffect(() => {
    buscarDados();
  }, []);

  // Retorna todas as constantes
  return {
    alunos, turmas, carregando, erro, sucesso, metricas, validarDadosAluno, buscarDados,
    criarAluno, editarAluno, deletarAluno, esvaziarBanco, popularBanco
  };
}

export default useAlunos;