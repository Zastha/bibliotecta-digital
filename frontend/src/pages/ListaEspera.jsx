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
        <section className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Espera</h1>

            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Añadir usuarios a lista de espera</h2>
                <form onSubmit={unirse} className="flex flex-col md:flex-row gap-4 items-center">
                    <input className="flex-1 rounded border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" placeholder="ID de usuario" value={form.usuarioId} onChange={e => set('usuarioId', e.target.value)} required />
                    <input className="flex-1 rounded border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" placeholder="ID de libro" value={form.libroId} onChange={e => set('libroId', e.target.value)} required />
                    <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded transition">Unirse</button>
                </form>
                {error && <p className="mt-2 text-red-600 font-medium">{error}</p>}
                {ok && <p className="mt-2 text-green-600 font-medium">{ok}</p>}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                {lista.length === 0 ? (
                    <p className="text-gray-500">No hay usuarios en lista de espera.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-sky-100 text-gray-700">
                                    <th className="px-4 py-2 text-left">Usuario</th>
                                    <th className="px-4 py-2 text-left">Libro</th>
                                    <th className="px-4 py-2 text-left">Posición</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id || i} className="border-b hover:bg-sky-50">
                                        <td className="px-4 py-2">{e.usuario_nombre}</td>
                                        <td className="px-4 py-2">{e.libro_titulo}</td>
                                        <td className="px-4 py-2">{e.posicion || i + 1}</td>
                                        <td className="px-4 py-2">{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button onClick={() => salir(e.usuario_id, e.libro_id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">Salir</button>
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