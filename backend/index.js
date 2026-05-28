import express from 'express'
import cors from 'cors'
//Necessário para funcionamento do server
const servidor = express()
servidor.use(cors())
servidor.use(express.json())

const registros = [] //Banco de dados com nome criativo

// Rota de POST
servidor.post('/registros', (req, res) => { 
    const dados = req.body // pega o corpo da requisição

    //cria constantes para checar possiveis duplicatas
    const duplicataNome = registros.find(r => r.nome.toLowerCase().trim() === dados.nome.toLowerCase().trim())
    const duplicataEmail = registros.find(r => r.email.toLowerCase().trim() === dados.email.toLowerCase().trim())
    const duplicataId = registros.find(r => r.notebookId.trim() === dados.notebookId.trim())

    //Checagens de válidade do nome do usuário
    if (!dados.nome) {
        //Checa se o campo está vazio
        return res.status(400).json({
            erro: "Campo de nome é Obrigatório!"
        })
        
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        //Checa se o nome contem o número minimo ou maximo de caracteres
        return res.status(400).json({
            erro: "Nome inválido, deve conter entre 3-100 caracteres"
        })
    } else if (duplicataNome) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.email) {
        //Checa se o campo está vazio
        return res.status(400).json({
            erro: "Campo de email é Obrigatório!"
        })
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        //Faz uma checagem basica de email, se contem um "@" e um "."
        return res.status(400).json({
            erro: "Email inválido!"
        })
    } else if (duplicataEmail) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.senha) {
        //Checa se o usuario criou uma senha
        return res.status(400).json({
            erro: "Campo de senha é Obrigatório!"
        })
    } else if (dados.senha.length < 7) {
        //Limita a senha para conter 
        return res.status(400).json({
            erro: "Senha inválida, deve conter mínimo de 7 caracteres"
        })
    }

    if (!dados.notebookId) {
        //Basico,  checa se está vazio
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    } else if (duplicataId) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Notebook indisponível"
        })
    } else if(dados.notebookId < 1 || dados.notebookId > 200) {
        // Faz uma checagem maneira para ver se o notebook tá dentro do valor esperado
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    }

    console.log(`Dados da requisição!
        O que tem no corpo que o front end me mandou : ${dados}`)

    registros.push(dados) // simulando salvar dados no banco

    res.status(201).json({
        sucesso: true,
        mensagem: "Registro Criado Com Sucesso!",
        dados: dados
    })

})

// Rota de GET
servidor.get("/registros", (req, res) => {
    res.status(200).json(registros)
})

// Rota DELETE
servidor.delete("/registros/:id", (req, res) => {
    const id = parseInt(req.params.id)

    if (id < 0 || id >= registros.length) {
        return res.status(404).json({erro: "Aluno não encontrado!"})
    }

    registros.splice(id, 1)
    res.status(200).json({ mensagem: "Aluno removido"})
})


// Rota PUT
servidor.put("/registros/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const dados = req.body

    // Cria uma copia de registros e depois remove o registro que está sendo modificado, serve para checar o unicidade sem gerar conflitos
    const registrosCopia = [...registros]
    registrosCopia.splice(id, 1)

    const duplicataNome = registrosCopia.find(r => r.nome.toLowerCase().trim() === dados.nome.toLowerCase().trim())
    const duplicataEmail = registrosCopia.find(r => r.email.toLowerCase().trim() === dados.email.toLowerCase().trim())
    const duplicataId = registrosCopia.find(r => r.notebookId.trim() === dados.notebookId.trim())



    if (id < 0 || id >= registros.length) {
        return res.status(404).json({erro: "Registro não encontrado!"})
    }

    //Checagens de válidade do nome do usuário
    if (!dados.nome) {
        //Checa se o campo está vazio
        return res.status(400).json({
            erro: "Campo de nome é Obrigatório!"
        })
        
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        //Checa se o nome contem o número minimo ou maximo de caracteres
        return res.status(400).json({
            erro: "Nome inválido, deve conter entre 3-100 caracteres"
        })
    } else if (duplicataNome) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.email) {
        //Checa se o campo está vazio
        return res.status(400).json({
            erro: "Campo de email é Obrigatório!"
        })
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        //Faz uma checagem basica de email, se contem um "@" e um "."
        return res.status(400).json({
            erro: "Email inválido!"
        })
    }  else if (duplicataEmail) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Usuário já cadastrado"
        })
    } 

    if (!dados.senha) {
        //Checa se o usuario criou uma senha
        return res.status(400).json({
            erro: "Campo de senha é Obrigatório!"
        })
    } else if (dados.senha.length < 7) {
        //Limita a senha para conter 
        return res.status(400).json({
            erro: "Senha inválida, deve conter mínimo de 7 caracteres"
        })
    }

    if (!dados.notebookId) {
        //Basico,  checa se está vazio
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    } else if(dados.notebookId < 1 || dados.notebookId > 200) {
        // Faz uma checagem maneira para ver se o notebook tá dentro do valor esperado
        return res.status(400).json({
            erro: "Número do notebook inválido!"
        })
    } else if (duplicataId) {
        //Chama a constante de duplicata para checar se o usuario já existe
        return res.status(409).json({
            erro: "Notebook indisponível"
        })
    }

    registros[id] = dados
    res.status(200).json({mensagem: "Registro Atualizado com Sucesso!", dados: registros[id]})
})


// Mensagem básica da página principal do servidor
servidor.get("/", (req,res) => (
    res.status(200).json({
        mensagem: "Servidor está ligado",
        status: "Funcional"
    })
))

servidor.listen(3000, () =>{
    console.log('Servidor hospedado em  '+ 'http://localhost:3000')
})