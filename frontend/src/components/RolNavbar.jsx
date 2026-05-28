import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRol } from '../hooks/roles';
import {setAuthId} from '../services/api';

export default function RolNavbar() {

    const { rol, authId,usuarioId, loading } = useRol();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = () => {
    logout();
    setAuthId(null);
    navigate('/login');
};

    if (loading) return <nav className="border-b border-slate-200 bg-slate-950/95 px-4 py-4 text-slate-100 shadow-sm backdrop-blur sm:px-6 lg:px-8"><p className="mx-auto max-w-7xl text-sm text-slate-300">Cargando...</p></nav>;
    if (!rol) return null;

    // Traducir el rol a un nombre bonito
    const nombreRol = {
        'administrador': 'Administrador',
        'alumno': 'Alumno',
        'maestro': 'Maestro'
    }[rol] || 'Usuario';

     const rutaListaEspera = rol === 'administrador' 
        ? '/lista-espera' 
        : `/lista-espera/usuario/${usuarioId}`;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-slate-950/95 px-4 py-4 text-slate-100 shadow-lg shadow-slate-950/10 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-lg font-semibold tracking-wide text-sky-300">Biblioteca - {nombreRol}</div>
            <ul className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-200">
                <li>
                    <NavLink 
                        to={rutaListaEspera}
                        className={({isActive}) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}
                    >
                        Lista de Espera
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/prestamos" 
                        className={({isActive}) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}
                    >
                        Préstamos
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/libros" 
                        className={({isActive}) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}
                    >
                        Libros
                    </NavLink>
                </li>

                {/* Solo mostrar Licencias si es ADMINISTRADOR */}
                {rol === 'administrador' && (
                    <>
                        <li>
                            <NavLink 
                                to="/usuarios" 
                                className={({isActive}) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}
                            >
                                Usuarios
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/licencias" 
                                className={({isActive}) => `rounded-full px-3 py-2 transition ${isActive ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-white/10 hover:text-white'}`}
                            >
                                Licencias
                            </NavLink>
                        </li>
                    </>
                )}
               
                {/* Mostrar el auth-id actual */}
                <li className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-2 text-xs text-sky-100">
                    <span className="font-mono" title="auth-id">{authId}</span>
                </li>
                <li>
                    <button onClick={cerrarSesion} className="rounded-full border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
                        Cerrar sesión
                    </button>
                </li>
            </ul>
            </div>
            
        </nav>
    );
}
