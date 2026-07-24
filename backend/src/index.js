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
            INSERT INTO alunos (nome, email, senha, turma_id, notebook_numero) 
            VALUES (?, ?, ?, ?, ?) RETURNING *
        `).bind(dados.nome.trim(), dados.email.trim(), dados.senha, dados.turmaId, dados.notebookId).first()

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

// Rota GET (LISTAR TURMAS)
servidor.get("/turmas", async (c) => {
    try {
        // Busca todas as turmas cadastradas no banco D1
        const { results } = await c.env.DB.prepare('SELECT * FROM turmas').all()
        
        return c.json(results, 200)
    } catch (e) {
        console.error("Erro ao listar turmas:", e)
        return c.json({ erro: "Erro interno do servidor ao buscar as turmas." }, 500)
    }
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

    if (!dados.turmaId || Number(dados.turmaId) <= 0) {
        return c.json({ erro: "A seleção de uma turma é obrigatória!" }, 400)
    }

    const turmaExiste = await c.env.DB.prepare('SELECT id FROM turmas WHERE id = ?').bind(dados.turmaId).first()
    if (!turmaExiste) {
        return c.json({ erro: "A turma selecionada não existe no sistema." }, 404)
    }

    try {
        // Garante que o notebook físico existe (caso ele esteja mudando para um número novo)
        await c.env.DB.prepare("INSERT OR IGNORE INTO notebooks (numero, status) VALUES (?, 'em_uso')").bind(dados.notebookId).run()

        // Atualiza os dados no banco
        const registroAtualizado = await c.env.DB.prepare(`
            UPDATE alunos 
            SET nome = ?, email = ?, senha = ?, turma_id = ?, notebook_numero = ? 
            WHERE id = ? RETURNING *
        `).bind(dados.nome.trim(), dados.email.trim(), dados.senha, dados.turmaId, dados.notebookId, id).first()
        
        return c.json({mensagem: "Registro Atualizado com Sucesso!", dados: registroAtualizado}, 200)

    } catch (e) {
        return c.json({ erro: "Erro ao atualizar dados no banco." }, 500)
    }
})

// Rotas dev (limpeza e povoamento do banco de dados)
servidor.delete('/dev/limpar', async (c) => {
  try {
    const db = c.env.DB; // Acessa o banco D1 configurado no wrangler.toml

    // Deleta todos os registros das duas tabelas
    await db.batch([
      db.prepare('DELETE FROM alunos'),
      db.prepare('DELETE FROM turmas')
    ]);

    return c.json({ sucesso: true, mensagem: 'Banco de dados esvaziado com sucesso.' }, 200);

  } catch (erro) {
    console.error("Erro ao limpar banco:", erro);
    return c.json({ erro: 'Falha ao esvaziar o banco de dados.', detalhes: erro.message }, 500);
  }
});

// 2. Rota para popular o banco (Seed)
servidor.post('/dev/seed', async (c) => {
  try {
    const db = c.env.DB;

    // Opcional: Esvaziar antes de popular para evitar duplicações de testes
    await db.batch([
      db.prepare('DELETE FROM alunos'),
      db.prepare('DELETE FROM turmas')
    ]);

    // Query 1: Criando as turmas base (Fixando o ID para garantir o relacionamento)
    const seedTurmas = db.prepare(`
      INSERT INTO turmas (id, nome, turno) VALUES 
      (1, 'T04A', 'Manhã'),
      (2, 'T04B', 'Manhã'),
      (3, 'T05A', 'Tarde'),
      (4, 'T05B', 'Tarde'),
      (5, 'T06A', 'Noite'),
      (6, 'T06B', 'Noite')
    `);

    // Query 2: Inserindo alunos de teste vinculados às turmas
    const seedAlunos = db.prepare(`
      INSERT INTO alunos (nome, email, senha, turma_id, notebook_numero) VALUES 
      ('João Silva', 'joao.silva@cerquilha.br', 'senha123', 1, 10),
      ('Maria Oliveira', 'maria.oliveira@cerquilha.br', 'senha123', 1, 11),
      ('Pedro Santos', 'pedro.santos@cerquilha.br', 'senha123', 1, 12),
      ('Ana Costa', 'ana.costa@cerquilha.br', 'senha123', 2, 13),
      ('Lucas Pereira', 'lucas.pereira@cerquilha.br', 'senha123', 2, 14),
      ('Juliana Lima', 'juliana.lima@cerquilha.br', 'senha123', 2, 15),
      ('Marcos Rodrigues', 'marcos.rodrigues@cerquilha.br', 'senha123', 3, 16),
      ('Fernanda Alves', 'fernanda.alves@cerquilha.br', 'senha123', 3, 17),
      ('Gabriel Gomes', 'gabriel.gomes@cerquilha.br', 'senha123', 3, 18),
      ('Camila Martins', 'camila.martins@cerquilha.br', 'senha123', 4, 19),
      ('Rafael Barbosa', 'rafael.barbosa@cerquilha.br', 'senha123', 4, 20),
      ('Letícia Ribeiro', 'leticia.ribeiro@cerquilha.br', 'senha123', 4, 21),
      ('Thiago Carvalho', 'thiago.carvalho@cerquilha.br', 'senha123', 5, 22),
      ('Beatriz Rocha', 'beatriz.rocha@cerquilha.br', 'senha123', 5, 23),
      ('Felipe Mendes', 'felipe.mendes@cerquilha.br', 'senha123', 5, 24),
      ('Mariana Cardoso', 'mariana.cardoso@cerquilha.br', 'senha123', 6, 25),
      ('Gustavo Dias', 'gustavo.dias@cerquilha.br', 'senha123', 6, 26),
      ('Amanda Castro', 'amanda.castro@cerquilha.br', 'senha123', 6, 27),
      ('Rodrigo Souza', 'rodrigo.souza@cerquilha.br', 'senha123', 6, 28),
      ('Bruna Fernandes', 'bruna.fernandes@cerquilha.br', 'senha123', 6, 29);
    `);

    // Executa as duas inserções de uma vez usando batch
    await db.batch([
      seedTurmas,
      seedAlunos
    ]);

    return c.json({ sucesso: true, mensagem: 'Dados de teste populados com sucesso.' }, 201);

  } catch (erro) {
    console.error("Erro ao popular banco:", erro);
    return c.json({ erro: 'Falha ao inserir dados de teste.', detalhes: erro.message }, 500);
  }
});

// Rota de métricas
servidor.get("/metricas", async (c) => {
    try {
        const db = c.env.DB;

        // 1. Pega os totais gerais (Quantos alunos e quantos notebooks únicos estão em uso)
        const totais = await db.prepare(`
            SELECT 
                COUNT(id) as totalAlunos, 
                COUNT(DISTINCT notebook_numero) as notebooksEmUso 
            FROM alunos
        `).first();

        // 2. Pega a distribuição por Turno (Já formata para o Recharts {name, value})
        const { results: turnos } = await db.prepare(`
            SELECT t.turno as name, COUNT(a.id) as value 
            FROM alunos a 
            JOIN turmas t ON a.turma_id = t.id 
            GROUP BY t.turno
        `).all();

        // 3. Pega a distribuição por Turma
        const { results: turmasStats } = await db.prepare(`
            SELECT t.nome, t.turno, COUNT(a.id) as totalAlunos 
            FROM turmas t 
            LEFT JOIN alunos a ON t.id = a.turma_id 
            GROUP BY t.id
        `).all();

        // Cálculos finais da Frota
        const limiteNotebooks = 200;
        const totalAlunos = totais.totalAlunos || 0;
        const notebooksEmUso = totais.notebooksEmUso || 0;
        const notebooksDisponiveis = Math.max(0, limiteNotebooks - notebooksEmUso);
        const taxaOcupacao = Math.round((notebooksEmUso / limiteNotebooks) * 100) || 0;

        return c.json({
            totalAlunos,
            notebooksEmUso,
            notebooksDisponiveis,
            taxaOcupacao,
            limiteNotebooks,
            alunosPorTurno: turnos, // O Hono já envia no formato que o Gráfico precisa
            alunosPorTurma: turmasStats
        }, 200);

    } catch (e) {
        console.error("Erro ao gerar métricas:", e);
        return c.json({ erro: "Erro ao calcular métricas no banco de dados." }, 500);
    }
});

// Mensagem básica da página principal do servidor
servidor.get("/", (c) => (
    c.json({
        mensagem: "Servidor backend está conectado ao Cloudflare D1",
        status: "Online e Persistente"
    })
))

export default servidor