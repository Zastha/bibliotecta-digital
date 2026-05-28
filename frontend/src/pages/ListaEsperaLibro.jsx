import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function ListaEsperaLibro(){
    const { libroId } = useParams();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/lista-espera/libro/${libroId}`)
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    }, [libroId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;

    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Detalle</p>
                <h1 className="text-3xl font-bold text-slate-900">Lista de Espera del libro</h1>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {lista.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay usuarios en lista de espera para este libro.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-4 py-3 font-medium">Usuario</th>
                                    <th className="px-4 py-3 font-medium">Posición</th>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-800">{e.usuario_nombre}</td>
                                        <td className="px-4 py-3 text-slate-600">{e.posicion || i + 1}</td>
                                        <td className="px-4 py-3 text-slate-600">{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
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