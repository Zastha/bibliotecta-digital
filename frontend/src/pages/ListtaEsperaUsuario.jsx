import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function ListaEsperaUsuario() {
    const { usuarioId } = useParams();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/lista-espera/usuario/${usuarioId}`)
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    }, [usuarioId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <section>
            <h1>Lista de Espera</h1>
            {lista.length === 0 ? (
                <p>No está en ninguna lista de espera.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Libro</th>
                            <th>Posición</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((e, i) => (
                            <tr key={e.id || i}>
                                <td>{e.libro_titulo}</td>
                                <td>{e.posicion || i + 1}</td>
                                <td>{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}