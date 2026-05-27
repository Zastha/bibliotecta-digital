import { useState, useEffect } from 'react';
import api from '../services/api';

export function useRol() {
    const [rol, setRol] = useState(null);
    const [authId, setAuthId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarRol = async () => {
            try {
                
                const authIdActual = api.defaults.headers['auth-id'];
                setAuthId(authIdActual);

                
                const response = await api.get('/usuarios');
                
                
                const usuario = response.data.data.find(u => u.auth_id === authIdActual);
                
                if (usuario) {
                    setRol(usuario.rol);
                } else {
                    setRol('alumno'); 
                }
            } catch (err) {
                console.error('Error al cargar rol:', err);
                setRol('alumno'); 
            } finally {
                setLoading(false);
            }
        };

        cargarRol();
    }, []);

    return { rol, authId, loading };
}