import { Navigate } from 'react-router-dom';
import { useRol } from '../hooks/roles';

export function Ruta({ children, rolRequerido = null }) {
    const { rol } = useRol();

    if (!rol) return <Navigate to="/login" replace />;

    if (rolRequerido && rol !== rolRequerido) {
        return <Navigate to="/login" replace />;
    }

    return children;
}