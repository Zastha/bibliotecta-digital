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

    const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200';
    const cardClass = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';
    const primaryButtonClass = 'inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700';

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
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Administración</p>
                <h1 className="text-3xl font-bold text-slate-900">Licencias</h1>
                <p className="text-sm text-slate-600">Gestiona licencias disponibles por libro.</p>
            </div>

            <div className={`${cardClass} mb-6`}>
                <h2 className="text-lg font-semibold text-slate-900">Nueva licencia</h2>
                <form onSubmit={crear} className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                        {ok && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}
                        <select className={inputClass} value={libroId} onChange={e => setLibroId(e.target.value)} required>
                            <option value="">-- Selecciona un libro --</option>
                            {libros.map(l => (
                                <option key={l.id} value={l.id}>{l.titulo} - {l.autor}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={primaryButtonClass}>Crear</button>
                </form>
            </div>

            <input
                className="mb-6 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Buscar por nombre de libro..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
            />

            <div className={cardClass}>
                {licencias.filter(l =>
                    l.libro_titulo?.toLowerCase().includes(busqueda.toLowerCase())
                ).length === 0 ? (
                    <p className="text-sm text-slate-500">No hay licencias disponibles.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">ID</th>
                                    <th className="py-3 pr-4 font-medium">Libro</th>
                                    <th className="py-3 pr-4 font-medium">Estado</th>
                                    <th className="py-3 pr-4 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {licencias
                                    .filter(l =>
                                        l.libro_titulo?.toLowerCase().includes(busqueda.toLowerCase())
                                    )
                                    .map(l => (
                                        <tr key={l.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="py-3 pr-4 text-slate-800"><a className="font-medium text-sky-700 hover:text-sky-900" href={`/licencias/libro/${l.libro_id}`}>{l.id}</a></td>
                                            <td className="py-3 pr-4 text-slate-800">{l.libro_titulo}</td>
                                            <td className="py-3 pr-4 text-slate-600">{l.estado}</td>
                                            <td className="py-3 pr-4"><button onClick={() => eliminar(l.id)} className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100">Eliminar</button></td>
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