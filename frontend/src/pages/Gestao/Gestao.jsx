import { useEffect, useState, useRef } from "react";
import InputField from "../../components/InputField";
import Botao from "../../components/BotaoEnviar";
import useAlunos from "../../hooks/useAlunos"; // hook que faz comunicação com backend
import styles from "../Gestao/Gestao.module.css"; // CSS módulo para a página de gestão

function Gestao() {
    // Referências para focar automaticamente em cada campo quando houver erro de validação
    const nomeRef = useRef(null);
    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const turmaRef = useRef(null);
    const notebookRef = useRef(null);

    const [user, setUser] = useState({ // campos do formulário
        nome: "",
        email: "",
        senha: "",
        turmaId: "",
        notebookId: ""
    });
    // Estado para o campo de pesquisa na lista de alunos
    const [termoPesquisa, setTermoPesquisa] = useState("");
    
    // mensagens locais do formulário
    const [erroForm, setErroForm] = useState("");
    const [sucessoForm, setSucessoForm] = useState(false);

    // salva o id do aluno que esta sendo editado
    const [indiceEditando, setIndiceEditando] = useState(null);

    const {    // dados e funções vindas do hook
        alunos,
        turmas = [],
        carregando,
        criarAluno,
        editarAluno,
        deletarAluno,
        erro,
        sucesso
    } = useAlunos();

    useEffect(() => {  // monitora sucesso vindo do hook

        if (sucesso) {

            setSucessoForm(true);

            // limpa formulário depois da operação
            setUser({
                nome: "",
                email: "",
                senha: "",
                turmaId: "",
                notebookId: ""
            });

            // sai do modo edição
            setIndiceEditando(null);
        }

    }, [sucesso]);

    // limpa mensagem de sucesso depois de 4 segundos
    useEffect(() => {

        if (sucessoForm) {

            const timer = setTimeout(() => {

                setSucessoForm(false);

            }, 4000);

            return () => clearTimeout(timer);
        }

    }, [sucessoForm]);

    // envia formulário com validações completas
    const handlerSubmit = async (e) => {

        if (e) e.preventDefault();

        setErroForm("");
        setSucessoForm(false);

        // Se passar por todas as validações, envia para o backend
        if (indiceEditando !== null) {

            await editarAluno(
                indiceEditando,
                user
            );

        } else {

            // cria aluno novo
            await criarAluno(user);
        }
    };

    // Permite submeter o formulário ao pressionar a tecla Enter em qualquer campo
    const handlerKeyDown = (e) => {
        if (e.key === "Enter") {
            handlerSubmit(e);
        }
    };

    // carrega dados do aluno no formulário
    const handlerEditar = (id) => {

        // procura aluno pelo id
        const registro = alunos.find(
            aluno => aluno.id === id
        );

        // coloca dados no formulário
        setUser({
            nome: registro.nome,
            email: registro.email,
            senha: registro.senha || "",
            turmaId: registro.turmaId || "",
            notebookId: registro.notebookId
        });

        // activa modo edição
        setIndiceEditando(id);

        // coloca cursor no input nome
        if (nomeRef.current) {

            nomeRef.current.focus();
        }
    };

    // deleta aluno selecionado
    const handlerDeletar = async (id) => {
        const confirmado = window.confirm(`Tem certeza que deseja excluir o aluno "${nomeAluno}"? Esta ação não pode ser desfeita.`);
        
        if (confirmado) {
            await deletarAluno(id);
        }
    };

    // Lógica de Filtragem da Lista de Alunos (Pesquisa por Nome, Email, Notebook ou Turma)
    const alunosFiltrados = alunos.filter(item => {
        const termo = termoPesquisa.toLowerCase();
        
        // Descobre o nome e o turno da turma do aluno para permitir a busca por turma também
        const turmaDoAluno = turmas.find(t => Number(t.id) === Number(item.turmaId || item.turma_id));
        const nomeTurma = turmaDoAluno ? turmaDoAluno.nome.toLowerCase() : "";
        const turnoTurma = turmaDoAluno ? turmaDoAluno.turno.toLowerCase() : "";
        
        const nome = item.nome ? item.nome.toLowerCase() : "";
        const email = item.email ? item.email.toLowerCase() : "";
        const notebook = String(item.notebookId || item.notebook_numero || "");

        return (
            nome.includes(termo) ||
            email.includes(termo) ||
            notebook.includes(termo) ||
            nomeTurma.includes(termo) ||
            turnoTurma.includes(termo)
        );
    });

    return (

        <div className={styles.managementPage}>

            <header className={styles.header}>
                <h1>Gestão de Equipamentos</h1>
                <p>
                    Cadastre e vincule alunos aos notebooks do inventário.
                </p>
            </header>

            <div className={styles.gestaoGrid}>

                {/* Formulário de Cadastro */}
                <div className="card">
                    <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
                        {indiceEditando !== null ? 'Editar Aluno' : 'Cadastrar Aluno'}
                    </h2>

                    {/* loading */}
                    {carregando && (
                        <p className={`${styles.statusMessage} ${styles.statusLoading}`}>
                            Carregando informações...
                        </p>
                    )}

                    <form onSubmit={handlerSubmit}>

                        {/* erro local ou erro vindo do backend */}
                        {(erroForm || erro) && (

                            <p className={`${styles.statusMessage} ${styles.statusError}`}>
                                {erroForm || erro}
                            </p>
                        )}

                        {/* sucesso */}
                        {sucessoForm && (

                            <p className={`${styles.statusMessage} ${styles.statusSuccess}`}>
                                Operação realizada com sucesso!
                            </p>
                        )}

                        <div className={styles.inputsStack}>
                            {/* nome */}
                            <InputField
                                label="Nome"
                                type="text"
                                name="nome"
                                placeholder="Ex: Portgas D. Ace"
                                value={user.nome}

                                onChange={(e) =>

                                    setUser(dados => ({
                                        ...dados,
                                        nome: e.target.value
                                    }))
                                }

                                onKeyDown={handlerKeyDown}
                                inputRef={nomeRef}
                            />

                            {/* email */}
                            <InputField
                                label="E-mail"
                                type="email"
                                name="email"
                                placeholder="exemplo@email.com"
                                value={user.email}

                                onChange={(e) =>

                                    setUser(dados => ({
                                        ...dados,
                                        email: e.target.value
                                    }))
                                }

                                onKeyDown={handlerKeyDown}
                                inputRef={emailRef}
                            />

                            {/* senha */}
                            <InputField
                                label="Senha"
                                type="password"
                                name="senha"
                                placeholder="Mínimo 7 caracteres"
                                value={user.senha}

                                onChange={(e) =>

                                    setUser(dados => ({
                                        ...dados,
                                        senha: e.target.value
                                    }))
                                }

                                onKeyDown={handlerKeyDown}
                                inputRef={senhaRef}
                            />

                            {/* turma */}
                            <div className={styles.selectContainer}>
                                <label className={styles.selectLabel} htmlFor="turmaId">
                                    Turma
                                </label>

                                <select
                                    id="turmaId"
                                    name="turmaId"
                                    ref={turmaRef}
                                    value={user.turmaId || ""}
                                    onChange={(e) => setUser(dados => ({ ...dados, turmaId: e.target.value }))}
                                    onKeyDown={handlerKeyDown}
                                    className={styles.customSelect}
                                >
                                    <option value="">Selecione uma turma...</option>
                                    {turmas.map((turma) => (
                                        <option key={turma.id} value={turma.id}>
                                            {turma.nome} — {turma.turno}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* notebook */}
                            <InputField
                                label="Número do Notebook"
                                type="number"
                                name="notebookId"
                                placeholder="Número entre 1 e 200"
                                value={user.notebookId}

                                onChange={(e) =>

                                    setUser(dados => ({
                                        ...dados,
                                        notebookId: e.target.value
                                    }))
                                }

                                onKeyDown={handlerKeyDown}
                                inputRef={notebookRef}
                            />
                        </div>

                        {/* botões */}
                        <div className={styles.formActions}>

                            <Botao
                                texto={
                                    indiceEditando !== null
                                        ? 'Atualizar Aluno'
                                        : 'Cadastrar Aluno'
                                }
                            />

                            {/* botão cancelar edição */}
                            {indiceEditando !== null && (

                                <button
                                    type="button"
                                    className={styles.btnCancel}
                                    onClick={() => {

                                        // sai modo edição
                                        setIndiceEditando(null);

                                        // limpa formulário
                                        setUser({
                                            nome: '',
                                            email: '',
                                            senha: '',
                                            turmaId: '',
                                            notebookId: ''
                                        });

                                        setErroForm("");
                                    }}
                                >

                                    Cancelar

                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* Lista de Alunos */}
                <div className="card">

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <h2 style={{ fontSize: '18px', margin: 0 }}>
                            Alunos Cadastrados
                        </h2>
                        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500' }}>
                            Total: {alunosFiltrados.length} de {alunos.length}
                        </span>
                    </div>

                    {/* Input de Pesquisa por Turma, Aluno ou Notebook */}
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, email, turma ou notebook..."
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                            className={styles.searchInput}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {alunosFiltrados.length > 0 ? (

                        <ul className={styles.alunosList}>

                            {/* percorre alunos filtrados */}
                            {alunosFiltrados.map((item) => {
                                // Encontra os detalhes da turma correspondente ao aluno
                                const turmaDoAluno = turmas.find(t => Number(t.id) === Number(item.turmaId || item.turma_id));
                                const infoTurma = turmaDoAluno ? `${turmaDoAluno.nome} — ${turmaDoAluno.turno}` : "Turma não informada";
                                const numNotebook = item.notebookId || item.notebook_numero;

                                return (
                                    <li key={item.id} className={styles.alunoItem}>
                                        <div className={styles.alunoInfo}>
                                            <span className={styles.alunoName}>{item.nome}</span>
                                            <span className={styles.alunoSub}>
                                                {item.email}
                                                <span className={styles.alunoBadge}>Notebook #{numNotebook}</span>
                                                <span className={styles.alunoBadge} style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)' }}>
                                                    {infoTurma}
                                                </span>
                                            </span>
                                        </div>
                                        <div className={styles.alunoActions}>
                                            <button
                                                onClick={() => handlerEditar(item.id)}
                                                className={`${styles.btnAction} ${styles.btnEdit}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handlerDeletar(item.id, item.nome)}
                                                className={`${styles.btnAction} ${styles.btnDelete}`}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className={styles.emptyMessage}>
                            {alunos.length === 0 ? "Nenhum aluno registrado até o momento." : "Nenhum aluno encontrado com base na pesquisa."}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Gestao;