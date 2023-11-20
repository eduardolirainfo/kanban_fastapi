import React from "react";
import toast from "react-hot-toast";
import { useNavigate} from "react-router-dom";
 

function Logout(props) {
    const navigate = useNavigate();
    function logoutUser(){
        toast.success("Usuário deslogado com sucesso!");
        localStorage.removeItem("token");
        navigate("/login");
    }
 
    return (
 
            <button onClick={logoutUser}>Log out</button>
 
    );
    }


export default Logout;