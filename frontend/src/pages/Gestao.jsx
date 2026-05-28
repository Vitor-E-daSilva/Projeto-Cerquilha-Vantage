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

        // ativa modo edição
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

        <div
            style={{
                padding: '20px',
                color: '#fff',
                backgroundColor: '#222'
            }}
        >

            <h2>
                Formulário de Cadastro (Alunos)
            </h2>

            {/* loading */}
            {carregando && (
                <p style={{ color: 'yellow' }}>
                    Carregando...
                </p>
            )}

            <form onSubmit={handlerSubmit}>

                {/* erro local ou erro vindo do backend */}
                {(erroForm || erro) && (

                    <p style={{ color: 'red' }}>
                        {erroForm || erro}
                    </p>
                )}

                {/* sucesso */}
                {sucessoForm && (

                    <p style={{ color: 'green' }}>
                        Operação realizada com sucesso!
                    </p>
                )}

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

                {/* botões */}
                <div style={{ marginTop: '15px' }}>

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

                            style={{
                                marginLeft: '10px'
                            }}

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

            {/* lista de alunos */}
            <div style={{ marginTop: '30px' }}>

                <h3>
                    Alunos Cadastrados
                </h3>

                {alunos.length > 0 ? (

                    <ul>

                        {/* percorre todos alunos */}
                        {alunos.map((item) => (

                            <li
                                key={item.id}

                                style={{
                                    marginBottom: '15px'
                                }}
                            >

                                <strong>
                                    {item.nome}
                                </strong>

                                {" "}
                                - {item.email}

                                {" "}
                                (Notebook Nº: {item.notebookId})

                                {/* botões */}
                                <div
                                    style={{
                                        border: '2px solid #F4FF5B',

                                        borderRadius: '4px',

                                        padding: '6px',

                                        boxShadow:
                                            '0 0 10px #F4FF5B',

                                        marginTop: '5px',

                                        display: 'inline-block'
                                    }}
                                >

                                    {/* deletar */}
                                    <button
                                        onClick={() =>
                                            handlerDeletar(item.id)
                                        }

                                        style={{
                                            marginRight: '5px'
                                        }}
                                    >

                                        Deletar

                                    </button>

                                    {/* editar */}
                                    <button
                                        onClick={() =>
                                            handlerEditar(item.id)
                                        }
                                    >

                                        Editar

                                    </button>

                                </div>

                            </li>

                        ))}

                    </ul>

                ) : (

                    <p>
                        Nenhum aluno registrado até o momento.
                    </p>
                )}

            </div>

        </div>
    );
}

export default Gestao;

/*
GESTAO =============================

A gestao é responsável pela parte principal do CRUD de alunos do sistema.

Nele acontece:
- cadastro de alunos
- edição de alunos
- exclusao de alunos
- listagem dos alunos cadastrados

Tambem é nele que ficam:
- validações do formulário
- mensagens de erro e sucesso
- integração entre frontend e backend
- renderização dinâmica da lista de alunos

Ele faz oq? =============================

O usuário preenche o formulário:
- nome
- email
- senha
- notebook

O sistema valida os dados:
- senha mínima
- notebook entre 1 e 200
- campos obrigatórios

Após validar:
- os dados são enviados pro hook useAlunos
- o hook faz comunicação com backend

O backend:
- salva
- edita
- remove
- os alunos da lista

Dps disso:
- o React atualiza a tela automaticamente
- sem precisar dar F5

Hooks principais =============================

handlerSubmit
- envia formulário
- valida os dados
- decide se vai cadastrar ou editar

handlerEditar
- carrega os dados do aluno no formulário
- ativa modo edição

handlerDeletar
- remove aluno selecionado

Integraçao com o useAlunos =========================

O arquivo usa o hook personalizado useAlunos
pra centralizar toda comunicação com backend.

O hook controla:
- requisições da API
- loading
- erros
- sucesso
- atualização automática da lista

Objetivo =======================================

Centralizar o gerenciamento dos alunos
e dos notebooks utilizados no laboratório.


PELO AMOR DE DEUS APRESENTA DIREITO EU QUERO NOTA!!!!!!!!!!!!!!
*/

