import { useEffect, useState } from "react";
const BASE_URL = 'http://localhost:3000/Registros';

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


   async function buscarAlunos() {
    setCarregando(true);  //mostra a mensagem de carregamento 
    try {
        
      const resposta = await fetch(`${BASE_URL}/alunos`); // faz a requisição pra URL /alunos. Await serve pra esperar terminar isso pra depois ir pra outra linha
      const dados = await resposta.json(); //transforma a resposta do servidor em .json 
      setAlunos(dados); // serve pra atualizar a lista de alunos
    } catch (e) {
      setErro("Erro ao conectar com o servidor. Verifique se o backend está rodando."); //mensagem de erro 
    } finally { //isso aqui roda independente se deu certo ou errado, nesse caso aqui ele serve pra tirar o carregamento
      setCarregando(false); 
    }
  }

  


}

