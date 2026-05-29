# Cerquilha 💻

**Sistema de Gestão de Notebooks — CajuHub** Projeto de Alocação de Ativos · Node.js + Express + React · leonardomaiaa

---

## 1. Visão Geral

O **Cerquilha** é um sistema web desenvolvido para gerenciar a distribuição e alocação de notebooks para os alunos da turma da manhã na CajuHub. O sistema garante que cada aluno tenha um único equipamento exclusivo (com numeração de 1 a 200), evitando conflitos de uso e centralizando o controle através de uma interface fluida com Dashboard analítico.

| Tipo | Sistema de Gestão de Inventário (Frontend + Backend) |
|------|---------------------------------------------------|
| Backend | Node.js + Express — API REST |
| Banco | Array em memória (sem banco real — reinicia ao fechar) |
| Frontend | React + Vite |
| Roteamento | React Router v7 |
| Porta API | http://localhost:3000 |
| Porta Web | http://localhost:5173 |

---

## 2. Estrutura de Pastas

Com base na arquitetura atual do repositório, o projeto é dividido de forma independente entre a API e a interface gráfica:


```

Projeto-Cerquilha-React/
├── backend/
│   ├── node_modules/               ← Dependências do servidor (gerado no install)
│   ├── .gitignore                  ← Arquivos ignorados pelo Git
│   ├── index.js                    ← Ponto de entrada: Servidor Express + Rotas + Regras
│   ├── package-lock.json
│   └── package.json                ← Scripts e dependências do ecossistema backend
│
└── frontend/
├── public/                     ← Ativos públicos e ícones
├── src/                        ← Código-fonte do React (Componentes, Páginas, Hooks)
├── .gitignore
├── README.md                   ← Documentação local do frontend
├── eslint.config.js            ← Configuração de padronização de código
├── index.html                  ← HTML base do ecossistema Vite
├── package-lock.json
├── package.json                ← Scripts e dependências do frontend
└── vite.config.js              ← Configurações de build do Vite

```

---

## 3. Como Rodar o Projeto

Você precisa de **dois terminais abertos** simultaneamente para rodar a aplicação completa.

### Terminal 1 — Backend (API)

```bash
# Entre na pasta do backend
cd Projeto-Cerquilha-React/backend

# Instale as dependências essenciais
npm install

# Inicie o servidor
npm run dev

# Resultado esperado:
# Servidor rodando na porta http://localhost:3000

```

### Terminal 2 — Frontend (Interface)

```bash
# Entre na pasta do frontend
cd Projeto-Cerquilha-React/frontend

# Instale os pacotes de interface
npm install

# Inicie o ambiente de desenvolvimento do Vite
npm run dev

# Resultado esperado:
#   VITE ready
#   ➜  Local:   http://localhost:5173/

```

> ⚠️ **Aviso de Execução:** Certifique-se de iniciar o backend primeiro para que o hook do frontend consiga buscar o estado inicial dos dados sem falhas.

---

## 4. Rotas e Regras da API

O endpoint unificado responde na rota principal do backend.

| Método | Rota | Descrição | Status |
| --- | --- | --- | --- |
| `GET` | `/alunos` | Retorna a lista de alunos e seus notebooks alocados | 200 |
| `POST` | `/alunos` | Vincula um aluno a um notebook específico | 201 |
| `PUT` | `/alunos/:id` | Modifica os dados ou troca o número do notebook pelo ID | 200 |
| `DELETE` | `/alunos/:id` | Remove o vínculo do aluno e libera o notebook | 200 |

### Payload de Exemplo (JSON)

Ao cadastrar ou atualizar, o objeto deve seguir a estrutura de dados abaixo:

```json
{
  "nome": "Leonardo Maia",
  "email": "leonardo@cajuhub.com",
  "notebook": 45
}

```

---

## 5. Validações de Negócio

Para manter o inventário da CajuHub íntegro, o backend aplica as seguintes validações:

1. **Intervalo de Equipamentos:** O número do notebook informado deve obrigatoriamente estar entre `1` e `200`.
2. **Uso Exclusivo:** Um notebook **não pode** ser utilizado por mais de um aluno simultaneamente (Erro `409 Conflict`).
3. **Dados Obrigatórios:** Validação de campos de identificação do aluno antes de persistir no array de memória.

---

## 6. Telas do Frontend

### 📋 Gestão (CRUD)

Página operacional contendo o formulário de cadastro de alunos e a escolha do notebook. Exibe uma tabela dinâmica com todos os registros atuais, permitindo a edição rápida ou a exclusão dos vínculos.

### 📊 Dashboard

Painel estatístico que lê os dados em tempo real para apresentar insights à gestão da CajuHub, como:

* Total de alunos atendidos na turma da manhã.  
* Total de notebooks atualmente em uso (ocupados).
* Total de notebooks disponíveis em estoque (dentro do limite de 200).

---

## 7. Status do Desenvolvimento

| Funcionalidade | Status |
| --- | --- |
| Servidor Express e Middlewares (`cors` + `json`) | ✅ Pronto |
| CRUD Completo de Alunos/Notebooks | ✅ Pronto |
| Trava de limite de Notebooks (1 a 200) | ✅ Pronto |
| Bloqueio de duplicidade de hardware | ✅ Pronto |

---

*Cerquilha · Sistema de Gestão de Ativos · CajuHub — Turma da Manhã*

```
