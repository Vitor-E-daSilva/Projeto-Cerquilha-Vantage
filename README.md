# Cerquilha Vantage 💻⚡

**Sistema Serverless de Alta Performance para Gestão e Alocação de Notebooks**  
*Plataforma Full-Stack na Borda (Edge Computing) · Hono + Cloudflare D1/Workers + React + Victory*

---

## 🌐 Acesse o Sistema no Ar

A aplicação está publicada e pronta para uso em ambiente de produção de alta disponibilidade:

👉 **[https://cerquilha-vantage.sitedealtonivel.workers.dev](https://cerquilha-vantage.sitedealtonivel.workers.dev)**

---

## 1. Visão Geral

O **Cerquilha Vantage** é uma solução web moderna e extremamente rápida desenvolvida para automatizar o controle, distribuição e auditoria de equipamentos portáteis (notebooks). O sistema garante que cada aluno tenha um único equipamento vinculado (com trava rígida de limite de 1 a 200 notebooks), eliminando conflitos de uso e centralizando insights operacionais através de um Dashboard analítico dinâmico.

Concebido como uma evolução de um protótipo de gestão, o **Cerquilha Vantage** foi totalmente reconstruído do zero para rodar sobre a infraestrutura Serverless global da Cloudflare, combinando respostas em milissegundos no backend com uma experiência de usuário (UX) fluida e responsiva no frontend.

---

## 2. Destaques e Arquitetura

* **Infraestrutura de Borda (Edge Computing):** Backend distribuído executando no **Cloudflare Workers**, garantindo disponibilidade 24/7 e latência mínima.
* **Banco de Dados Relacional Serverless:** Uso do **Cloudflare D1** (SQLite relacional na nuvem), garantindo persistência e integridade dos dados sem a necessidade de servidores tradicionais.
* **API REST em Alta Velocidade:** Construída com **Hono.js**, um framework ultraleve otimizado para ambientes serverless.
* **Dashboard Analítico com Victory:** Visualização gráfica vetorial (SVG) da distribuição de alunos por turno, ocupação total da frota e densidade de turmas.
* **Busca e Filtragem Inteligente:** Pesquisa em tempo real por nome, e-mail, número de notebook ou turma na tela de gestão e na listagem segmentada.
* **UX Tátil com Foco Automático:** Validações de formulário que identificam erros em tempo real e apontam o cursor automaticamente para o campo incorreto (`useRef.focus()`).
* **DevTools Integrado (Modo Demonstração):** Ferramentas no painel de configurações para popular o banco com dados de teste (*Seed*) ou esvaziá-lo para avaliação do sistema.
* **Design Responsivo Coluna Única:** Layout perfeitamente adaptado para dispositivos móveis, sem quebras de tela ou barras de rolagem indesejadas.

---

## 3. Stack Tecnológico

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | **React + Vite** | Interface reativa rápida com componentes modulares |
| **Gráficos** | **Victory** | Visualização de dados dinâmica, responsiva e animada |
| **Roteamento** | **React Router v7** | Navegação por abas e rotas sem recarregar a página |
| **Backend** | **Hono.js** | Framework web moderno e performático para Edge Workers |
| **Banco de Dados** | **Cloudflare D1** | Banco relacional SQL nativo da nuvem |
| **Hospedagem** | **Cloudflare Workers & Pages** | Deploy serverless com alta disponibilidade global |

---

## 4. Estrutura do Projeto
```text
Projeto-Cerquilha-Vantage/
├── backend/
│   ├── src/
│   │   └── index.js          ← API Hono: Rotas REST, Queries SQL e Métricas
│   ├── schema.sql            ← Definição das tabelas relacionais (Alunos e Turmas)
│   ├── wrangler.toml         ← Configuração de Bindings D1 e deploy do Worker
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── icone.svg         ← Favicon vetorial customizado
    │   └── _redirects        ← Regras de roteamento para SPA
    ├── src/
    │   ├── components/       ← Inputs, Botões e Elementos reusáveis
    │   ├── hooks/
    │   │   └── useAlunos.js  ← Hook customizado para consumo da API e estado global
    │   ├── pages/
    │   │   ├── Dashboard/    ← Gráficos Victory e Relação por Turma
    │   │   ├── Gestao/       ← Formulário de cadastro e listagem filtrável
    │   │   └── Config/       ← Seção DevTools (Seed/Limpar) e Gerenciador de Temas
    │   └── styles/           ← Variáveis globais de cores e módulos CSS
    ├── package.json
    └── vite.config.js
```

---

## 5. Rotas da API REST

O backend responde por endpoints otimizados e seguros:

| Método | Rota | Descrição | Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/registros` | Retorna a lista de alunos e seus notebooks alocados | `200` |
| `POST` | `/registros` | Cadastra um aluno e vincula a um notebook livre | `201` |
| `PUT` | `/registros/:id` | Atualiza dados ou altera o notebook do aluno | `200` |
| `DELETE` | `/registros/:id` | Desvincula o aluno e libera o equipamento | `200` |
| `GET` | `/turmas` | Retorna as turmas e seus respectivos turnos | `200` |
| `GET` | `/metricas` | Consulta SQL agregada para os gráficos do Dashboard | `200` |
| `POST` | `/dev/seed` | Popula o banco com turmas e alunos de teste | `200` |
| `DELETE` | `/dev/limpar` | Reseta o banco de dados para testes | `200` |

---

## 6. Como Executar Localmente

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **Wrangler CLI** (ferramenta de desenvolvimento da Cloudflare)

### 1. Iniciando o Backend (API)

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor do Worker em modo de desenvolvimento
npm run dev
# Servidor disponível em: http://localhost:8787
```

### 2. Iniciando o Frontend (Interface)

```bash
# Entre na pasta do frontend
cd frontend

# Instale os pacotes de interface
npm install

# Inicie a aplicação no Vite
npm run dev
# Aplicação disponível em: http://localhost:5173
```
---

## 7. Regras de Negócio e Validações

* **Capacidade da Frota:** O equipamento deve obrigatoriamente estar entre os números `1` e `200`.
* **Exclusividade de Hardware:** Dois alunos não podem ter o mesmo notebook alocado simultaneamente (retorna erro `409 Conflict`).
* **Validação de Turmas:** Todo aluno cadastrado deve estar vinculado a uma turma válida cadastrada no sistema.
* **Integridade dos Dados:** Validação do formato de e-mail e restrição de senha mínima de 7 caracteres.

---

*Cerquilha Vantage · Sistema Serverless de Gestão de Ativos*