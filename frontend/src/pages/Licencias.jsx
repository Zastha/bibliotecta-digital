import {useState, useEffect} from 'react';
import api from '../services/api';

export default function Licencias() {
    const [licencias, setLicencias] = useState([]);
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [libroId, setLibroId] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const cargar = () => {
        setLoading(true);
        api.get('/licencias')
            .then(res => setLicencias(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar licencias'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargar();
        api.get('/libros').then(res => setLibros(res.data.data));
    }, []);

    const crear = async (e) => {
        e.preventDefault();
        setError(''); setOk('');
        try {
            await api.post('/licencias', { libroId });
            setOk('Licencia creada correctamente');
            setLibroId('');
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear licencia');
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm('¿Desea eliminar esta licencia?')) return;
        try {
            await api.delete(`/licencias/${id}`);
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar licencia');
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <section>
            <h1>Licencias</h1>

            <h2>Nueva licencia</h2>
            <form onSubmit={crear}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {ok && <p style={{ color: 'green' }}>{ok}</p>}
                <select value={libroId} onChange={e => setLibroId(e.target.value)} required>
                    <option value="">-- Selecciona un libro --</option>
                    {libros.map(l => (
                        <option key={l.id} value={l.id}>{l.titulo} - {l.autor}</option>
                    ))}
                </select>
                <button type="submit">Crear</button>
            </form>

            <input
                placeholder="Buscar por nombre de libro..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
            />

            {licencias.filter(l =>
                l.libro_titulo?.toLowerCase().includes(busqueda.toLowerCase())
            ).length === 0 ? (
                <p>No hay licencias disponibles.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Libro</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licencias
                            .filter(l =>
                                l.libro_titulo?.toLowerCase().includes(busqueda.toLowerCase())
                            )
                            .map(l => (
                                <tr key={l.id}>
                                    <td><a href={`/licencias/libro/${l.libro_id}`}>{l.id}</a></td>
                                    <td>{l.libro_titulo}</td>
                                    <td>{l.estado}</td>
                                    <td><button onClick={() => eliminar(l.id)}>Eliminar</button></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}