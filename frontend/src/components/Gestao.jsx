import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import InputField from "./InputField";

function Formulario(){
    const nomeRef = useRef
    const [user, setUser] = useState(nome, email, notebook, senha)
    const [erroForm, setErroForm] = useState('')

return(



<div style={{ padding: '20px', color: '#fff' }}>
    <h2>Formulário do Aluno</h2>
    <form onSubmit={handlerSubmit}>
        {/* {(erroForm || erro) && <p style={{ color: 'red' }}>{erroForm || erro}</p>}
        {sucesso && <p style={{ color: 'green' }}>Operação realizada com sucesso!</p>} */}

        <InputField
            label="Nome"
            type="text"
            name="Nome"
            placeholder="Gabriel..."
            value={user.nome}
            onChange={(e) => setUser(dados => ({ ...dados, nome: e.target.value }))}
            inputRef={nomeRef}
        />

        <InputField
            label="Email"
            type="email"
            name="Email"
            placeholder="exemplo@email.com"
            value={user.email}
            onChange={(e) => setUser(dados => ({ ...dados, telefone: e.target.value }))}
        />

        <InputField
            label="Notebook"
            type="number"
            name="Notebook"
            placeholder="032"
            value={user.notebook}
            onChange={(e) => setUser(dados => ({ ...dados, email: e.target.value }))}
        />

        <InputField
            label="Senha"
            type="number"
            name="Senha"
            placeholder="Insira a Senha aqui!"
            value={user.senha}


        />
        <Botao texto={indiceEditando !== null ? 'Atualizar' : 'Cadastrar'} />
        {indiceEditando !== null && (
            <button
                type="button"
                onClick={() => {
                    setIndiceEditando(null); // Desliga a edição e volta ao modo criação
                    setUser({ nome: '', email: '', telefone: '', nomeMae: '' }); // Limpa os campos
                }}           >
                Cancelar edição
            </button>
        )}

    </form>
</div>

)}