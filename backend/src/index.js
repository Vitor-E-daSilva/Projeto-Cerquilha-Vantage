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

servidor.post('/registros', async (c) => { 
    const dados = await c.req.json() // pega o corpo da requisição

    // Checagens de validade básicas do Frontend (Mantidas intactas)
    if (!dados.nome || dados.nome.trim() === "") {
        return c.json({ erro: "Campo de nome é Obrigatório!" }, 400)
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        return c.json({ erro: "Nome inválido, deve conter entre 3-100 caracteres" }, 400)
    } 

    if (!dados.email) {
        return c.json({ erro: "Campo de email é Obrigatório!" }, 400)
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        return c.json({ erro: "Email inválido!" }, 400)
    } 

    if (!dados.senha) {
        return c.json({ erro: "Campo de senha é Obrigatório!" }, 400)
    } else if (dados.senha.length < 7) {
        return c.json({ erro: "Senha inválida, deve conter mínimo de 7 caracteres" }, 400)
    }

    if (!dados.notebookId) {
        return c.json({ erro: "Número do notebook inválido!" }, 400)
    } else if(Number(dados.notebookId) < 1 || Number(dados.notebookId) > 200) {
        return c.json({ erro: "Número do notebook inválido!" }, 400)
    }

    // CONSULTAS NO BANCO DE DADOS D1 (Substituindo o antigo array.find)
    const duplicataEmail = await c.env.DB.prepare('SELECT id FROM alunos WHERE email = ?').bind(dados.email.trim()).first()
    if (duplicataEmail) {
        return c.json({ erro: "Usuário já cadastrado" }, 409)
    } 

    const duplicataId = await c.env.DB.prepare('SELECT id FROM alunos WHERE notebook_numero = ?').bind(dados.notebookId).first()
    if (duplicataId) {
        return c.json({ erro: "Notebook indisponível" }, 409)
    }

    try {
        // Truque de Mestre: Garante que o Notebook Físico exista na tabela "notebooks" antes de associar ao aluno
        await c.env.DB.prepare("INSERT OR IGNORE INTO notebooks (numero, status) VALUES (?, 'em_uso')").bind(dados.notebookId).run()

        // Insere o aluno e usa "RETURNING *" para já devolver a linha recém-criada (com o ID gerado pelo banco)
        const novoRegistro = await c.env.DB.prepare(`
            INSERT INTO alunos (nome, email, senha, notebook_numero) 
            VALUES (?, ?, ?, ?) RETURNING *
        `).bind(dados.nome.trim(), dados.email.trim(), dados.senha, dados.notebookId).first()

        return c.json({
            sucesso: true,
            mensagem: "Registro Criado Com Sucesso!",
            dados: novoRegistro
        }, 201)

    } catch (e) {
        console.error("Erro ao salvar no banco:", e)
        return c.json({ erro: "Erro interno do servidor ao salvar os dados." }, 500)
    }
})

// Rota de GET (LISTAR)
servidor.get("/registros", async (c) => {
    // Traz a lista inteira de alunos. O .all() retorna um objeto { results: [...] }
    const { results } = await c.env.DB.prepare('SELECT * FROM alunos').all()
    
    // Convertendo a resposta do banco para combinar com o que o Frontend já espera
    // (O frontend espera que o número do notebook venha como "notebookId")
    const alunosFormatados = results.map(aluno => ({
        ...aluno,
        notebookId: aluno.notebook_numero 
    }))

    return c.json(alunosFormatados, 200)
})

// Rota DELETE (REMOVER)
servidor.delete("/registros/:id", async (c) => {
    const id = parseInt(c.req.param('id')) 
    
    // Manda deletar e verifica quantas linhas (changes) foram apagadas
    const info = await c.env.DB.prepare('DELETE FROM alunos WHERE id = ?').bind(id).run()

    if (info.meta.changes === 0) {
        return c.json({erro: "Aluno não encontrado!"}, 404)
    }

    return c.json({ mensagem: "Aluno removido"}, 200)
})

// Rota PUT (ATUALIZAR)
servidor.put("/registros/:id", async (c) => {
    const id = parseInt(c.req.param('id'))
    const dados = await c.req.json() 
    
    // Checa se o aluno realmente existe no banco
    const alunoExiste = await c.env.DB.prepare('SELECT id FROM alunos WHERE id = ?').bind(id).first()
    if (!alunoExiste) {
        return c.json({erro: "Registro não encontrado!"}, 404)
    }

    // Checagem de duplicatas (EXCLUINDO o próprio ID da checagem, simulando sua antiga "registrosCopia")
    const duplicataEmail = await c.env.DB.prepare('SELECT id FROM alunos WHERE email = ? AND id != ?').bind(dados.email.trim(), id).first()
    const duplicataId = await c.env.DB.prepare('SELECT id FROM alunos WHERE notebook_numero = ? AND id != ?').bind(dados.notebookId, id).first()

    // Validações básicas (iguais ao POST)
    if (!dados.nome || dados.nome.trim() === "") { 
        return c.json({ erro: "Campo de nome é Obrigatório!" }, 400)
    } else if(dados.nome.length > 100 || dados.nome.length < 3) {
        return c.json({ erro: "Nome inválido, deve conter entre 3-100 caracteres" }, 400)
    } 

    if (!dados.email) {
        return c.json({ erro: "Campo de email é Obrigatório!" }, 400)
    } else if (dados.email.split('.').length < 2 || dados.email.split('@').length < 2) {
        return c.json({ erro: "Email inválido!" }, 400)
    }  else if (duplicataEmail) {
        return c.json({ erro: "Usuário já cadastrado" }, 409)
    } 

    if (!dados.senha) {
        return c.json({ erro: "Campo de senha é Obrigatório!" }, 400)
    } else if (dados.senha.length < 7) {
        return c.json({ erro: "Senha inválida, deve conter mínimo de 7 caracteres" }, 400)
    }

    if (!dados.notebookId || Number(dados.notebookId) < 1 || Number(dados.notebookId) > 200) {
        return c.json({ erro: "Número do notebook inválido!" }, 400)
    } else if (duplicataId) {
        return c.json({ erro: "Notebook indisponível" }, 409)
    }

    try {
        // Garante que o notebook físico existe (caso ele esteja mudando para um número novo)
        await c.env.DB.prepare("INSERT OR IGNORE INTO notebooks (numero, status) VALUES (?, 'em_uso')").bind(dados.notebookId).run()

        // Atualiza os dados no banco
        const registroAtualizado = await c.env.DB.prepare(`
            UPDATE alunos 
            SET nome = ?, email = ?, senha = ?, notebook_numero = ? 
            WHERE id = ? RETURNING *
        `).bind(dados.nome.trim(), dados.email.trim(), dados.senha, dados.notebookId, id).first()
        
        return c.json({mensagem: "Registro Atualizado com Sucesso!", dados: registroAtualizado}, 200)

    } catch (e) {
        return c.json({ erro: "Erro ao atualizar dados no banco." }, 500)
    }
})

// Mensagem básica da página principal do servidor
servidor.get("/", (c) => (
    c.json({
        mensagem: "Servidor backend está conectado ao Cloudflare D1",
        status: "Online e Persistente"
    })
))

export default servidor