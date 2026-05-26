import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function LicenciasLibro() {
    const { libroId } = useParams();
    const [licencias, setLicencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/licencias/libro/${libroId}`)
            .then(res => setLicencias(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar licencias'))
            .finally(() => setLoading(false));
    }, [libroId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h1>Licencias del libro</h1>
            {licencias.length === 0 ? (
                <p>No hay licencias para este libro.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titulo</th>
                            <th>Estado</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {licencias.map(l => (
                            <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{l.libro_titulo}</td>
                                <td>{l.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}