import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
function Logout({updateRole}){
    const navigate = useNavigate();
    useEffect(()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        updateRole(null);

        navigate('/');

    }, [navigate, updateRole]);
    return(
        <div>

        </div>
    )
}

export default Logout

