import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function ListaEsperaUsuario() {
    const { usuarioId } = useParams();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');


    const cargar = () => {
        setLoading(true);
        api.get(`/lista-espera/usuario/${usuarioId}`)
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const cardClass = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';

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

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;
    if (ok) return <p className="px-4 py-8 text-sm text-emerald-600">{ok}</p>;

    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Detalle</p>
                <h1 className="text-3xl font-bold text-slate-900">Lista de Espera</h1>
            </div>
            <div className={cardClass}>
                {lista.length === 0 ? (
                    <p className="text-sm text-slate-500">No está en ninguna lista de espera.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-4 py-3 font-medium">Libro</th>
                                    <th className="px-4 py-3 font-medium">Posición</th>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                    <th className="px-4 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id || i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
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