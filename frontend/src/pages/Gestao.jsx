import { useEffect, useState, useRef } from "react";
import InputField from "../components/InputField"
import Botao from "../components/BotaoEnviar"
import useAlunos from "../hooks/useAlunos"; // hook que faz comunicação com backend

function Gestao() {
    const nomeRef = useRef(null); // referencia pro input nome
    const [user, setUser] = useState({ // campos do formulário
        nome: "",
        email: "",
        senha: "",
        notebookId: ""
    });

    // mensagens locais do formulário
    const [erroForm, setErroForm] = useState("");
    const [sucessoForm, setSucessoForm] = useState(false);

    // salva o id do aluno que esta sendo editado
    const [indiceEditando, setIndiceEditando] = useState(null);

    const {    // dados e funções vindas do hook
        alunos,
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

    // envia formulário
    const handlerSubmit = async (e) => {

        e.preventDefault();

        setErroForm("");
        setSucessoForm(false);

        // valida senha
        if (user.senha.length < 7) {

            setErroForm(
                "Senha inválida, deve conter mínimo de 7 caracteres"
            );

            return;
        }

        // transforma notebook em número
        const numNotebook = Number(user.notebookId);

        // valida notebook
        if (
            isNaN(numNotebook)
            || numNotebook < 1
            || numNotebook > 200
        ) {

            setErroForm(
                "Número do notebook inválido! Deve ser entre 1 e 200."
            );

            return;
        }

        // se estiver editando
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

        await deletarAluno(id);
    };

    return (

        <div className="dashboard-container management-page">

            <div className="form-card">
                <h2>
                    Formulário de Cadastro (Alunos)
                </h2>

                {/* loading */}
                {carregando && (
                    <p className="status-message loading">
                        Carregando...
                    </p>
                )}

                <form onSubmit={handlerSubmit}>

                    {/* erro local ou erro vindo do backend */}
                    {(erroForm || erro) && (

                        <p className="status-message error">
                            {erroForm || erro}
                        </p>
                    )}

                    {/* sucesso */}
                    {sucessoForm && (

                        <p className="status-message success">
                            Operação realizada com sucesso!
                        </p>
                    )}

                    <div className="form-grid">
                        {/* nome */}
                        <InputField
                            label="Nome: "
                            type="text"
                            name="nome"
                            placeholder="Portgas D. Ace"
                            value={user.nome}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    nome: e.target.value
                                }))
                            }

                            inputRef={nomeRef}
                        />

                        {/* email */}
                        <InputField
                            label="E-mail: "
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
                        />

                        {/* senha */}
                        <InputField
                            label="Senha: "
                            type="password"
                            name="senha"
                            placeholder="Digite uma senha segura"
                            value={user.senha}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    senha: e.target.value
                                }))
                            }
                        />

                        {/* notebook */}
                        <InputField
                            label="Número: "
                            type="number"
                            name="notebookId"
                            placeholder="Ex: 32"
                            value={user.notebookId}

                            onChange={(e) =>

                                setUser(dados => ({
                                    ...dados,
                                    notebookId: e.target.value
                                }))
                            }
                        />
                    </div>

                    {/* botões */}
                    <div className="form-actions">

                        <Botao
                            texto={
                                indiceEditando !== null
                                    ? 'Atualizar'
                                    : 'Cadastrar'
                            }
                        />

                        {/* botão cancelar edição */}
                        {indiceEditando !== null && (

                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => {

                                    // sai modo edição
                                    setIndiceEditando(null);

                                    // limpa formulário
                                    setUser({
                                        nome: '',
                                        email: '',
                                        senha: '',
                                        notebookId: ''
                                    });

                                    setErroForm("");
                                }}
                            >

                                Cancelar edição

                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* lista de alunos */}
            <div className="list-card">

                <h3>
                    Alunos Cadastrados
                </h3>

                {alunos.length > 0 ? (

                    <ul className="alunos-list">

                        {/* percorre todos alunos */}
                        {alunos.map((item) => (
                            <li key={item.id} className="aluno-item">
                                <div className="aluno-info">
                                    <span className="aluno-name">{item.nome}</span>
                                    <span className="aluno-sub">{item.email} • Notebook #{item.notebookId}</span>
                                </div>
                                <div className="aluno-actions">
                                    <button onClick={() => handlerEditar(item.id)} className="btn-edit">Editar</button>
                                    <button onClick={() => handlerDeletar(item.id)} className="btn-delete">Deletar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-message">Nenhum aluno registrado até o momento.</p>
                )}
            </div>
        </div>
    );
}

export default Gestao;
