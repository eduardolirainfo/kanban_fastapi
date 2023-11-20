import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Register(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();

    function handleUsernameChange(e){
        setUsername(e.target.value);
    }

    function handlePasswordChange(e){
        setPassword(e.target.value);
    }

    function handlePassword2Change(e){
        setPassword2(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        if(password !== password2){
            toast("Passwords do not match");
        }else{
            createUser().then(data => {
                if(data.detail){ 
                    toast.error('Deu ruim! Usuário já existe !');                   
                }else{
                    toast.success("Usuário criado com sucesso!");
                    props.setToken(data.access_token)
                    localStorage.setItem("token", JSON.stringify(data.access_token));
                    navigate("/");
                }
            }
            );
        }
    }

    async function createUser () {
        const formData = {
            username: username,
            password: password
        }
        const response = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        const data = await response.json(); 
        return data;
 
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} required/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} required/>
                <label htmlFor="password2">Confirm Password</label>
                <input type="password" id="password2" value={password2} onChange={handlePassword2Change} required/>
                <input type="submit" value="Register" />
                <p>Já possui cadastro? <Link 
                    to="/login"
                    style={{
                        color: "blue",
                        textDecoration: "underline",
                        marginLeft: "10px",
                    }}
                > Efetuar login aqui</Link></p>
            </form>
        </div>
    );
}

export default Register;