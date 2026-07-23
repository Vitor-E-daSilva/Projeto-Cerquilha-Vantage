function Botao({ texto }) {
    return (
        <>
            {/* Estilo do botão, css permanece nos componetes por eles serem menores em código*/}
            <style>
                {`
                    .btn-submit {
                        width: 100%;
                        padding: 11px 18px;
                        background-color: var(--accent);
                        color: #FFFFFF;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 600;
                        font-family: inherit;
                        cursor: pointer;
                        transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    }

                    .btn-submit:hover {
                        background-color: var(--accent-hover);
                        box-shadow: 0 4px 12px var(--accent-bg);
                    }

                    .btn-submit:active {
                        transform: scale(0.98);
                    }

                    .btn-submit:focus-visible {
                        outline: 2px solid var(--accent);
                        outline-offset: 2px;
                    }
                `}
            </style>

            {/* Codigo do botão em si */}
            <button type="submit" className="btn-submit">
                {texto}
            </button>
        </>
    );
}

export default Botao;