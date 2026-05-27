import {useEffect, useState} from 'react';
import api from '../services/api';

export default function ListaEspera() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [form, setForm] = useState({ usuarioId: '', libroId: '' });

    const cargar = () => {
        setLoading(true);
        api.get('/lista-espera')
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const unirse = async (e) => {
        e.preventDefault();
        setError(''); setOk('');
        try {
            await api.post('/lista-espera', form);
            setOk('Agregado a la lista de espera');
            setForm({ usuarioId: '', libroId: '' });
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al unirse');
        }
    };

    const salir = async (usuarioId, libroId) => {
    if (!window.confirm('¿Salir de la lista de espera?')) return;
    setError(''); setOk('');
    try {
        await api.patch('/lista-espera/desactivar', { usuarioId, libroId });
        setOk('Saliste de la lista de espera');
        cargar();
    } catch (err) {
        setError(err.response?.data?.error || 'Error al salir');
    }
};

    if (loading) return <p>Cargando lista de espera...</p>;

    return (
        <section>
            <h1>Lista de Espera</h1>

            <h2>Unirse a lista de espera</h2>
            <form onSubmit={unirse}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {ok && <p style={{ color: 'green' }}>{ok}</p>}
                <input placeholder="ID de usuario" value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)} required />
                <input placeholder="ID de libro" value={form.libroId} onChange={e => set('libroId', e.target.value)} required />
                <button type="submit">Unirse</button>
            </form>

            {lista.length === 0 ? (
                <p>No hay usuarios en lista de espera.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Libro</th>
                            <th>Posición</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lista.map((e, i) => (
                            <tr key={e.id || i}>
                                <td>{e.usuario_nombre}</td>
                                <td>{e.libro_titulo}</td>
                                <td>{e.posicion || i + 1}</td>
                                <td>{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
                                <td><button onClick={() => salir(e.usuario_id, e.libro_id)}>Salir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}