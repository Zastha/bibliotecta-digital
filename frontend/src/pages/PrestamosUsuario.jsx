import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function PrestamosUsuario() {
    const { usuarioId } = useParams();
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/prestamos/usuario/${usuarioId}`)
            .then(res => setPrestamos(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar préstamos'))
            .finally(() => setLoading(false));
    }, [usuarioId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h1>Préstamos del usuario</h1>
            {prestamos.length === 0 ? (
                <p>Este usuario no tiene préstamos.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Libro</th>
                            <th>Fecha préstamo</th>
                            <th>Fecha vencimiento</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.map(p => (
                            <tr key={p.id}>
                                <td>{p.libro_titulo}</td>
                                <td>{new Date(p.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                <td>{new Date(p.fecha_vencimiento).toLocaleDateString('es-MX')}</td>
                                <td>{p.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}