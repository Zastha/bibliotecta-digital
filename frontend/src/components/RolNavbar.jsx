import { NavLink } from 'react-router-dom';
import { useRol } from '../hooks/roles';
import './RolNavbar.css';

export default function RolNavbar() {

    const { rol, authId, loading } = useRol();

    if (loading) return <nav className="rol-nav"><p>Cargando...</p></nav>;
    if (!rol) return null;

    // Traducir el rol a un nombre bonito
    const nombreRol = {
        'administrador': 'Administrador',
        'alumno': 'Alumno',
        'maestro': 'Maestro'
    }[rol] || 'Usuario';

    return (
        <nav className="rol-nav">
            <div className="rol-brand">Biblioteca - {nombreRol}</div>
            <ul className="rol-links">
                
                <li>
                    <NavLink 
                        to="/prestamos" 
                        className={({isActive}) => isActive ? 'active' : ''}
                    >
                        Préstamos
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                        to="/libros" 
                        className={({isActive}) => isActive ? 'active' : ''}
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
                                className={({isActive}) => isActive ? 'active' : ''}
                            >
                                Usuarios
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/licencias" 
                                className={({isActive}) => isActive ? 'active' : ''}
                            >
                                Licencias
                            </NavLink>
                        </li>
                    </>
                )}
               
                {/* Mostrar el auth-id actual */}
                <li className="auth-id-badge">
                    <span title="auth-id">{authId}</span>
                </li>
            </ul>
        </nav>
    );
}
