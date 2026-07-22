import { Hono } from 'hono'
import { cors } from 'hono/cors'

//Necessário para funcionamento do server
const servidor = new Hono()
servidor.use('/*', cors({
    origin: [
    'http://localhost:5173',
    'https://cerquilha-vantage.sitedealtonivel.workers.dev'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

const registros = [] //Banco de dados com nome criativo
let proximoId = 1 // ID automático para cada registro

// Rota de POST
servidor.post('/registros', async (c) => { 
    const dados = await c.req.json() // pega o corpo da requisição de forma assíncrona no Hono

    //cria constantes para checar possiveis duplicatas
    const duplicataNome = registros.find(r => r.nome.toLowerCase().trim() === dados.nome.toLowerCase().trim())
    const duplicataEmail = registros.find(r => r.email.toLowerCase().trim() === dados.email.toLowerCase().trim())
    // Convertido para string para garantir a checagem do trim() caso venha como número
    const duplicataId = registros.find(r => String(r.notebookId).trim() === String(dados.notebookId).trim())

    //Checagens de válidade do nome do usuário
    if (!dados.nome || dados.nome.trim() === "") {
        //Checa se o campo está vazio
        return c.json({
            erro: "Campo de nome é Obrigatório!"
        }, 400) // Status code é passado como segundo argumento
        
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        //Checa se o nome contem o número minimo ou maximo de caracteres
        return c.json({
            erro: "Nome inválido, deve conter entre 3-100 caracteres"
        }, 400)
    } else if (duplicataNome) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Usuário já cadastrado"
        }, 409)
    } 

    if (!dados.email) {
        //Checa se o campo está vazio
        return c.json({
            erro: "Campo de email é Obrigatório!"
        }, 400)
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        //Faz uma checagem basica de email, se contem um "@" e um "."
        return c.json({
            erro: "Email inválido!"
        }, 400)
    } else if (duplicataEmail) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Usuário já cadastrado"
        }, 409)
    } 

    if (!dados.senha) {
        //Checa se o usuario criou uma senha
        return c.json({
            erro: "Campo de senha é Obrigatório!"
        }, 400)
    } else if (dados.senha.length < 7) {
        //Limita a senha para conter 
        return c.json({
            erro: "Senha inválida, deve conter mínimo de 7 caracteres"
        }, 400)
    }

    if (!dados.notebookId) {
        //Basico,  checa se está vazio
        return c.json({
            erro: "Número do notebook inválido!"
        }, 400)
    } else if (duplicataId) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Notebook indisponível"
        }, 409)
    } else if(Number(dados.notebookId) < 1 || Number(dados.notebookId) > 200) {
        // Faz uma checagem maneira para ver se o notebook tá dentro do valor esperado
        // Convertido para Number para garantir validação correta de limite
        return c.json({
            erro: "Número do notebook inválido!"
        }, 400)
    }

    console.log(`Dados da requisição!
        O que tem no corpo que o front end me mandou : ${JSON.stringify(dados)}`) // JSON.stringify para imprimir o objeto corretamente

    // Adiciona ID único antes de salvar
    const novoRegistro = {
        id: proximoId++,
        ...dados
    }
    
    registros.push(novoRegistro) // simulando salvar dados no banco

    return c.json({
        sucesso: true,
        mensagem: "Registro Criado Com Sucesso!",
        dados: novoRegistro
    }, 201) // 201 Created
})

// Rota de GET
servidor.get("/registros", (c) => {
    return c.json(registros, 200)
})

// Rota DELETE
servidor.delete("/registros/:id", (c) => {
    // Parâmetros de rota no Hono são pegos com c.req.param()
    const id = parseInt(c.req.param('id')) 
    
    // Busca o índice pelo campo id, não pela posição do array
    const index = registros.findIndex(r => r.id === id)

    if (index === -1) {
        return c.json({erro: "Aluno não encontrado!"}, 404) // 404 Not Found é mais semântico que 409 aqui
    }

    registros.splice(index, 1)
    return c.json({ mensagem: "Aluno removido"}, 200)
})

// Rota PUT
servidor.put("/registros/:id", async (c) => {
    // Parâmetros de rota no Hono
    const id = parseInt(c.req.param('id'))
    // Corpo da requisição assíncrono
    const dados = await c.req.json() 
    
    // Busca o índice pelo campo id
    const index = registros.findIndex(r => r.id === id)

    if (index === -1) {
        return c.json({erro: "Registro não encontrado!"}, 404) // c.json() com 404
    }

    // Cria uma copia de registros e depois remove o registro que está sendo modificado, serve para checar o unicidade sem gerar conflitos
    const registrosCopia = [...registros]
    registrosCopia.splice(index, 1)

    const duplicataNome = registrosCopia.find(r => r.nome.toLowerCase().trim() === dados.nome.toLowerCase().trim())
    const duplicataEmail = registrosCopia.find(r => r.email.toLowerCase().trim() === dados.email.toLowerCase().trim())
    // String() para garantir compatibilidade com trim()
    const duplicataId = registrosCopia.find(r => String(r.notebookId).trim() === String(dados.notebookId).trim())

    //Checagens de válidade do nome do usuário
    if (!dados.nome || dados.nome.trim() === "") { 
        //Checa se o campo está vazio
        return c.json({
            erro: "Campo de nome é Obrigatório!"
        }, 400)
        
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        //Checa se o nome contem o número minimo ou maximo de caracteres
        return c.json({
            erro: "Nome inválido, deve conter entre 3-100 caracteres"
        }, 400)
    } else if (duplicataNome) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Usuário já cadastrado"
        }, 409)
    } 

    if (!dados.email) {
        //Checa se o campo está vazio
        return c.json({
            erro: "Campo de email é Obrigatório!"
        }, 400)
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        //Faz uma checagem basica de email, se contem um "@" e um "."
        return c.json({
            erro: "Email inválido!"
        }, 400)
    }  else if (duplicataEmail) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Usuário já cadastrado"
        }, 409)
    } 

    if (!dados.senha) {
        //Checa se o usuario criou uma senha
        return c.json({
            erro: "Campo de senha é Obrigatório!"
        }, 400)
    } else if (dados.senha.length < 7) {
        //Limita a senha para conter 
        return c.json({
            erro: "Senha inválida, deve conter mínimo de 7 caracteres"
        }, 400)
    }

    if (!dados.notebookId) {
        //Basico,  checa se está vazio
        return c.json({
            erro: "Número do notebook inválido!"
        }, 400)
    } else if(Number(dados.notebookId) < 1 || Number(dados.notebookId) > 200) {
        // Faz uma checagem maneira para ver se o notebook tá dentro do valor esperado
        return c.json({
            erro: "Número do notebook inválido!"
        }, 400)
    } else if (duplicataId) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return c.json({
            erro: "Notebook indisponível"
        }, 409)
    }

    // Mantém o ID original ao atualizar
    registros[index] = {
        id: registros[index].id,
        ...dados
    }
    
    return c.json({mensagem: "Registro Atualizado com Sucesso!", dados: registros[index]}, 200)
})

// Mensagem básica da página principal do servidor
servidor.get("/", (c) => (
    c.json({
        mensagem: "Servidor está ligado",
        status: "Funcional"
    })
))

export default {
    fetch: servidor.fetch // o export default servidor estava gerando erros, essa versão usa fetch para evitar isso
}