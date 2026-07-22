import { useEffect, useState } from "react";
const BASE_URL = `${import.meta.env.VITE_API_URL}/registros`;

function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

    // Limpa as mensagens após 4 segundos
  useEffect(() => {
    if (erro || sucesso) {  //se der erro ou sucesso... 
      const timer = setTimeout(() => { //comeca o cronometro de 4 segundos pra desaparecer as mensagens 
        setErro(null); //depois de 4 segundos deixa o campo nulo
        setSucesso(null);  //  depois de 4 segundos deixa o campo nulo
      }, 4000); //4 segundos
      //cleartimeout serve pra limpar o timer
      return () => clearTimeout(timer);
    }
  }, [erro, sucesso]); //MONITORA essas duas variaveis, é o gatilho pra começar. O codigo so funciona quando essas consts sao ativadas

//buscar alunos
   async function buscarAlunos() {
    setCarregando(true);  //mostra a mensagem de carregamento 
    try {
// faz a requisição pra URL . Await serve pra esperar terminar isso pra depois ir pra outra linha
      const resposta = await fetch(BASE_URL); 
      const dados = await resposta.json(); //transforma a resposta do servidor em .json 
      setAlunos(dados); // serve pra atualizar a lista de alunos
    } catch (e) {
      setErro("Erro ao conectar com o servidor. Verifique se o backend está rodando."); //mensagem de erro 
    } finally { //isso aqui roda independente se deu certo ou errado, nesse caso aqui ele serve pra
               //  tirar a mensagem carregamento
      setCarregando(false); 
    }
  }

  // Cria um novo aluno
  async function criarAluno(dadosAluno) { 
    setCarregando(true); //mensagem de carregamento
    try {
// faz a requisição pra URL . Await serve pra esperar terminar isso pra depois ir pra outra linha
      const resposta = await fetch(BASE_URL, { 
        method: "POST", //isso aqui diz ao servidor que vamos ENVIAR um dado novo 
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify(dadosAluno), 
      });

      const dados = await resposta.json(); //traduz a resposta do servidor 

//o erro vem antes por segurança 
//barra primeiro pra impedir que execute o que vem depois
      if (!resposta.ok) {  //se o cadastro for rejeitado
        setErro(dados.erro);  //mostra o erro
        return false; //retorna que deu errado
      }

      setSucesso("Aluno cadastrado com sucesso!"); //mensagem de sucesso 
      await buscarAlunos();  // puxa a lista nova de alunos e mostra na tela sem dar f5, useState força isso
      return true; //retorna que deu certo
    } catch (e) {
      setErro("Erro ao cadastrar aluno."); // mensagem de erro 
      return false;
    } finally { //isso aqui roda independente se deu certo ou errado, nesse caso aqui ele serve 
               // pra tirar a mensagem de carregamento
      setCarregando(false);
    }
  }  

    // Edita um aluno existente
  async function editarAluno(id, dadosAluno) {
    setCarregando(true); // mostra o efeito de carregament na tela
    try {  
      const resposta = await fetch(`${BASE_URL}/${id}`, { 
        method: "PUT", // PUT fala pro servidor que vamos substituir um dado existente
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAluno),  
      });

      const dados = await resposta.json(); // traduz a resposta do servidor 

      if (!resposta.ok) { //se der erro...
        setErro(dados.erro); // mostra o erro traduzido 
        return false;
      }

      setSucesso("Aluno atualizado com sucesso!");
      await buscarAlunos(); // puxa a lista nova de alunos e mostra na tela sem dar f5, useState força isso
      return true; // mostra o efeito de carregamento na tela
    } catch (e) {
      setErro("Erro ao editar aluno."); 
      return false;
    } finally {    // isso aqui acontece independente do que ocorrer
      setCarregando(false); // tira do estado de carregamento
    }
  }

  

  //deleta aluno
    async function deletarAluno(id) { // deleta o aluno pelo id 
    setCarregando(true); // mostra o estado de carregamento 
    try {
      const resposta = await fetch(`${BASE_URL}/${id}`, { 
        method: "DELETE", //diz pro seridor que vamos deletar
      });

      const dados = await resposta.json();   // traduz a resposta do servidor 

      if (!resposta.ok) { 
        setErro(dados.erro); // mostra o erro
        return false;
      }

      setSucesso("Aluno excluído com sucesso!"); 
      await buscarAlunos(); // puxa a lista nova de alunos e mostra na tela sem dar f5, useState força isso
      return true; 
    } catch (e) {
      setErro("Erro ao excluir aluno.");
      return false;
    } finally { // isso aqui acontece independente de dar erro ou sucesso   
      setCarregando(false); // desliga o carregamento 
    }
  }

  useEffect(() => {
    buscarAlunos(); // chama a funcao que busca os alunos 
  }, []); // [] vazios fazem com que isso rode apenas uma vez quando a pagina abrir 

  return {
    alunos,
    carregando,
    erro,
    sucesso,
    buscarAlunos,
    criarAluno,
    editarAluno,
    deletarAluno,
  };
}

export default useAlunos;