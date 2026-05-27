function InputField({ label, type, name, placeholder, value, onChange,  inputRef}) { 
    return(
        <div>
            <label> {label}</label>
            <input type={type} name = {name} placeholder = {placeholder} value= {value}  onChange = {onChange} ref = {inputRef} />
            
        </div>
    )
}
export default InputField;