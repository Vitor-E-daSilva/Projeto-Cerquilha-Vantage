import React from 'react';

function InputField({ label, type, name, placeholder, value, onChange, inputRef }) {
  return (
    <div className="input-field-container">
      {/* CSS */}
      <style>
        {`
          .input-field-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
            text-align: left;
          }

          .input-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-h);
            letter-spacing: 0.2px;
          }

          .custom-input {
            width: 100%;
            padding: 10px 14px;
            background-color: var(--bg);
            color: var(--text-h);
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .custom-input::placeholder {
            color: var(--text);
            opacity: 0.6;
          }

          /* Estado de Foco alinhado com a cor do tema ativo */
          .custom-input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px var(--accent-bg);
          }
        `}
      </style>

      {/* Rótulo / Label do Input */}
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
        </label>
      )}

      {/* Campo de Entrada */}
      <input
        id={name}
        ref={inputRef}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="custom-input"
        autoComplete="off"
      />
    </div>
  );
}

export default InputField;