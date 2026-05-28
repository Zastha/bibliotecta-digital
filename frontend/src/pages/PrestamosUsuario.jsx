import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function PrestamosUsuario() {
    const { usuarioId } = useParams();
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/prestamos/usuario/${usuarioId}`)
            .then(res => setPrestamos(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar préstamos'))
            .finally(() => setLoading(false));
    }, [usuarioId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;

    return (
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Historial</p>
                <h1 className="text-3xl font-bold text-slate-900">Préstamos del usuario</h1>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {prestamos.length === 0 ? (
                    <p className="text-sm text-slate-500">Este usuario no tiene préstamos.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">Libro</th>
                                    <th className="py-3 pr-4 font-medium">Fecha préstamo</th>
                                    <th className="py-3 pr-4 font-medium">Fecha vencimiento</th>
                                    <th className="py-3 pr-4 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map(p => (
                                    <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="py-3 pr-4 text-slate-800">{p.libro_titulo}</td>
                                        <td className="py-3 pr-4 text-slate-600">{new Date(p.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                        <td className="py-3 pr-4 text-slate-600">{new Date(p.fecha_vencimiento).toLocaleDateString('es-MX')}</td>
                                        <td className="py-3 pr-4 text-slate-700">{p.estado}</td>
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