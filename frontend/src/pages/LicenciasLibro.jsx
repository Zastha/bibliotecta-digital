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
    if (error) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;

    return (
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Detalle</p>
                <h1 className="text-3xl font-bold text-slate-900">Licencias del libro</h1>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {licencias.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay licencias para este libro.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">ID</th>
                                    <th className="py-3 pr-4 font-medium">Título</th>
                                    <th className="py-3 pr-4 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {licencias.map(l => (
                                    <tr key={l.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="py-3 pr-4 text-slate-800">{l.id}</td>
                                        <td className="py-3 pr-4 text-slate-600">{l.libro_titulo}</td>
                                        <td className="py-3 pr-4 text-slate-600">{l.estado}</td>
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