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

    const inputClass = 'flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200';
    const cardClass = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';
    const primaryButtonClass = 'inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-700';

    if (loading) return <p>Cargando lista de espera...</p>;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Turnos</p>
                <h1 className="text-3xl font-bold text-slate-900">Lista de Espera</h1>
                <p className="text-sm text-slate-600">Agrega usuarios o administra la cola de espera de los libros.</p>
            </div>

            <div className={`${cardClass} mb-8`}>
                <h2 className="text-xl font-semibold text-slate-900">Añadir usuarios a lista de espera</h2>
                <form onSubmit={unirse} className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
                    <input className={inputClass} placeholder="ID de usuario" value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)} required />
                    <input className={inputClass} placeholder="ID de libro" value={form.libroId} onChange={e => set('libroId', e.target.value)} required />
                    <button type="submit" className={primaryButtonClass}>Unirse</button>
                </form>
                {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                {ok && <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}
            </div>

            <div className={cardClass}>
                {lista.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay usuarios en lista de espera.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-4 py-3 font-medium">Usuario</th>
                                    <th className="px-4 py-3 font-medium">Libro</th>
                                    <th className="px-4 py-3 font-medium">Posición</th>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                    <th className="px-4 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id || i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-800">{e.usuario_nombre}</td>
                                        <td className="px-4 py-3 text-slate-800">{e.libro_titulo}</td>
                                        <td className="px-4 py-3 text-slate-600">{e.posicion || i + 1}</td>
                                        <td className="px-4 py-3 text-slate-600">{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => salir(e.usuario_id, e.libro_id)} className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100">Salir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}