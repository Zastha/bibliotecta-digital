import {createContext, useContext, useState} from "react";
import { setAuthId } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario,setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuario');

        if(guardado){
            const u = JSON.parse(guardado);
            setAuthId(u.auth_id);
            return u;
        }
        return null;
    });

    const login = (usuarioSeleccionado) =>{
        setUsuario(usuarioSeleccionado);
        localStorage.setItem('usuario', JSON.stringify(usuarioSeleccionado));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
        setAuthId(null);
    };

    return(
        <AuthContext.Provider value={{usuario, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}