import { useState, useEffect } from 'react';
import api from '../services/api';
import { useRol } from '../hooks/roles';

export default function Prestamos() {
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [form, setForm] = useState({ usuarioId: '', libroId: '', diasPrestamo: 14 });
    const [filtro, setFiltro] = useState('todos');
    const { rol, authId } = useRol();

    const cargar = (f) => {
        setLoading(true);
        let url;
        if(rol === 'administrador') {
            url = f === 'activos' ? '/prestamos/activos' 
                    : f === 'vencer' ? '/prestamos/vencer?dias=3'
                    : '/prestamos';
        } else {
            url = `/prestamos/usuario/${authId}`;
        }
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
            const mensaje = err.response?.data?.error || 'Error al crear préstamo';
            if (mensaje === 'No hay licencias disponibles para este libro') {
                const confirmar = window.confirm(mensaje + '. ¿Desea unirse a la lista de espera?');
                if (confirmar)  window.location.href = '/lista-espera';
            } else {
                setError(mensaje);
    }
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
        <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-slate-900">Préstamos</h1>
                <p className="text-sm text-slate-600">Solicita, filtra y devuelve préstamos desde una vista simple.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                <form onSubmit={crear} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-medium text-slate-900">Solicitar préstamo</h2>

                    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    {ok && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}

                    <input className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200" placeholder="ID de usuario" value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)} required />
                    <input className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200" placeholder="ID de libro" value={form.libroId} onChange={e => set('libroId', e.target.value)} required />
                    <input className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200" type="number" placeholder="Días de préstamo" value={form.diasPrestamo} onChange={e => set('diasPrestamo', parseInt(e.target.value))} required />

                    <button type="submit" className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700">
                        Solicitar
                    </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-medium text-slate-900">Listado</h2>
                        <div className="flex flex-wrap gap-2">
                            <button className={`rounded-xl px-3 py-2 text-sm font-medium transition ${filtro === 'todos' ? 'bg-sky-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`} onClick={() => setFiltro('todos')} disabled={filtro === 'todos'}>Todos</button>
                            <button className={`rounded-xl px-3 py-2 text-sm font-medium transition ${filtro === 'activos' ? 'bg-sky-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`} onClick={() => setFiltro('activos')} disabled={filtro === 'activos'}>Activos</button>
                            <button className={`rounded-xl px-3 py-2 text-sm font-medium transition ${filtro === 'vencer' ? 'bg-sky-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`} onClick={() => setFiltro('vencer')} disabled={filtro === 'vencer'}>Próx. a vencer</button>
                        </div>
                    </div>

                    {loading ? <p className="text-sm text-slate-500">Cargando...</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500">
                                        <th className="py-3 pr-4 font-medium">ID</th>
                                        {rol === 'administrador' && <th className="py-3 pr-4 font-medium">Usuario</th>}
                                        <th className="py-3 pr-4 font-medium">Libro</th>
                                        <th className="py-3 pr-4 font-medium">Fecha préstamo</th>
                                        <th className="py-3 pr-4 font-medium">Fecha vencimiento</th>
                                        <th className="py-3 pr-4 font-medium">Estado</th>
                                        <th className="py-3 pr-4 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prestamos.map(p => (
                                        <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="py-3 pr-4 text-slate-800">{p.id}</td>
                                            {rol === 'administrador' && <td className="py-3 pr-4 text-slate-700">{p.usuario_nombre}</td>}
                                            <td className="py-3 pr-4 text-slate-700">{p.libro_titulo}</td>
                                            <td className="py-3 pr-4 text-slate-600">{new Date(p.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                            <td className="py-3 pr-4 text-slate-600">{new Date(p.fecha_vencimiento).toLocaleDateString('es-MX')}</td>
                                            <td className="py-3 pr-4 text-slate-700">{p.estado}</td>
                                            <td className="py-3 pr-4">
                                                {p.estado === 'activo' && (
                                                    <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => devolver(p.id)}>
                                                        Devolver
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}