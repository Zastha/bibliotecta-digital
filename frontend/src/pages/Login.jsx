import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthId } from '../services/api';
import { useAuth } from '../context/AuthContext';


function Login(){
    const [usuarios, setUsuarios] = useState([]);
    const[seleccionado, setSeleccionado] = useState('');
    const [error,setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
    //Usamos una auth-id de admin para cargar los usuarios, en un caso real esto se haría con un login
    setAuthId('test-admin-001');
    api.get('/usuarios')
    .then(res => setUsuarios(res.data.data))
    .catch(()=> setError('Error al cargar usuarios'));
},[]);

const iniciarSesion = () =>{
    if(!seleccionado){
        setError('Selecciona un usuario para iniciar sesión');
        return;
    }

    const usuario = usuarios.find(u => u.id === seleccionado);
    setAuthId(usuario.auth_id);
    login(usuario);
    
    usuario.rol === 'administrador' ? navigate('/usuarios') : navigate('/libros');

};

return(

    <div>
        <div>

            <h1>Biblioteca Digital</h1>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <select value={seleccionado} onChange={e => setSeleccionado(e.target.value)}>
                <option value="">-- Selecciona un usuario --</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                ))}
            </select>
            <button onClick={iniciarSesion}>Iniciar Sesión</button>
        
        
        </div>


    </div>
)

}

export default Login;