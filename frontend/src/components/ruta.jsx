import { Navigate } from 'react-router-dom';
import { useRol } from '../hooks/roles';

export function Ruta({ children, rolRequerido = null }) {
    const { rol, loading } = useRol();

    if (loading) return <p>Cargando...</p>;

    
    if (rolRequerido && rol !== rolRequerido) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}