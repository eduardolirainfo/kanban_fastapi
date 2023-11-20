import React, {useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";

function Login(props){
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
        toast.dismiss()
        if(password !== password2){
            toast("As senhas não coincidem");
        }else{
            loginUser().then(data => {  
                if(data.detail){
                    toast.error('Deu ruim! Você digitou algo errado !');
                }else{
                    toast.success("Usuário logado com sucesso!");
                    props.setToken(data.access_token)
                    localStorage.setItem("token", JSON.stringify(data.access_token));
                    navigate("/");
                }
            }
            );
        }
    }

    async function loginUser () {
        const searchParams = new URLSearchParams();
        searchParams.append("username", username);
        searchParams.append("password", password);
 
        const response = await fetch('/token', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: searchParams.toString()
        });
        const data = await response.json(); 
        return data;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} required/>
                <label htmlFor="password2">Confirm Password</label>
                <input type="password" id="password2" value={password2} onChange={handlePassword2Change} required/>
                <input type="submit" value="Login" />
                <p>Ainda sem cadastro? <Link 
                    to="/register"
                    style={{
                        color: "blue",
                        textDecoration: "underline",
                        marginLeft: "10px",
                    }}
                > Cadastrar aqui</Link></p>
            </form>
        </div>
    );
}

export default Login;