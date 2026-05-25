import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Prestamos() {
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [form, setForm] = useState({ usuarioId: '', libroId: '', diasPrestamo: 14 });
    const [filtro, setFiltro] = useState('todos');

    const cargar = (f) => {
        setLoading(true);
        const url = f === 'activos' ? '/prestamos/activos' 
                    : f === 'vencer' ? '/prestamos/vencer?dias=3'
                    : '/prestamos';
        api.get(url)
            .then(res => setPrestamos(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar préstamos'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(filtro); }, [filtro]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const crear = async (e) => {
        e.preventDefault();
        setError(''); setOk('');
        try {
            await api.post('/prestamos', form);
            setOk('Préstamo creado correctamente');
            setForm({ usuarioId: '', libroId: '', diasPrestamo: 14 });
            cargar(filtro);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear préstamo');
        }
    };

    const devolver = async (id) => {
    if (!window.confirm('¿Confirmar devolución?')) return;
    try {
        await api.patch(`/prestamos/${id}/devolver`);
        cargar(filtro);
    } catch (err) {
        setError(err.response?.data?.error || 'Error al devolver');
    }
};

    return (
        <section>
            <h1>Préstamos</h1>

            <h2>Solicitar préstamo</h2>
            <form onSubmit={crear}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {ok && <p style={{ color: 'green' }}>{ok}</p>}
                <input placeholder="ID de usuario" value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)} required />
                <input placeholder="ID de libro" value={form.libroId} onChange={e => set('libroId', e.target.value)} required />
                <input type="number" placeholder="Días de préstamo" value={form.diasPrestamo} onChange={e => set('diasPrestamo', parseInt(e.target.value))} required />
                <button type="submit">Solicitar</button>
            </form>

            <section>
                <button onClick={() => setFiltro('todos')} disabled={filtro === 'todos'}>Todos</button>
                <button onClick={() => setFiltro('activos')} disabled={filtro === 'activos'}>Activos</button>
                <button onClick={() => setFiltro('vencer')} disabled={filtro === 'vencer'}>Próx. a vencer</button>
            </section>

            {loading ? <p>Cargando...</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Libro</th>
                            <th>Fecha préstamo</th>
                            <th>Fecha vencimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.usuario_nombre}</td>
                                <td>{p.libro_titulo}</td>
                                <td>{new Date(p.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                <td>{new Date(p.fecha_vencimiento).toLocaleDateString('es-MX')}</td>
                                <td>{p.estado === 'activo' && (<button onClick={() => devolver(p.id)}>Devolver</button>)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}