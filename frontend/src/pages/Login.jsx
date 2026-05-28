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
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/60 backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">Biblioteca Digital</p>
                    <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight sm:text-5xl">Accede con un usuario de prueba y navega según tu rol.</h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                        La sesión se guarda localmente y la interfaz cambia automáticamente entre administrador, maestro o alumno.
                    </p>
                </div>
                <div className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Usuarios</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Préstamos</div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Licencias</div>
                </div>
            </div>

            <div className="flex items-center p-6 sm:p-8 lg:p-10">
                <div className="w-full space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-900">Iniciar Sesión</h2>
                        <p className="text-sm text-slate-600">Selecciona un usuario para entrar al sistema.</p>
                    </div>

                    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">Usuario</span>
                        <select
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            value={seleccionado}
                            onChange={e => setSeleccionado(e.target.value)}
                        >
                            <option value="">-- Selecciona un usuario --</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                            ))}
                        </select>
                    </label>

                    <button onClick={iniciarSesion} className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700">
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    </section>
)

}

export default Login;