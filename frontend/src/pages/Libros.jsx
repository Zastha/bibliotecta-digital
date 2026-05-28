import { useState, useEffect } from 'react';
import { useRol } from '../hooks/roles';
import api from '../services/api';

export default function Libros() {
    const { rol } = useRol();  
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({titulo: '', autor: '', isbn: ''});

    const cargar = () => {
        setLoading(true);
        api.get('/libros')
            .then(res => setLibros(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200';
    const cardClass = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';
    const primaryButtonClass = 'inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700';

    const crear = async (e) => {
        e.preventDefault();
        try {
            await api.post('/libros', form);
            setForm({titulo: '', autor: '', isbn: ''});
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear libro');
        }
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Catálogo</p>
                <h1 className="text-3xl font-bold text-slate-900">Libros</h1>
                <p className="text-sm text-slate-600">Consulta el catálogo y, si eres administrador, agrega nuevos títulos.</p>
            </div>

            {rol === 'administrador' && (
                <div className={`${cardClass} mb-6`}>
                    <h2 className="text-lg font-semibold text-slate-900">Nuevo libro</h2>
                    <form onSubmit={crear} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
                        <input className={inputClass} placeholder="Título" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
                        <input className={inputClass} placeholder="Autor" value={form.autor} onChange={e => set('autor', e.target.value)} required />
                        <input className={inputClass} placeholder="ISBN" value={form.isbn} onChange={e => set('isbn', e.target.value)} required />
                        <button type="submit" className={primaryButtonClass}>Crear</button>
                    </form>
                </div>
            )}
                
            {error && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className={cardClass}>
                {loading ? <p className="text-sm text-slate-500">Cargando...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    {rol === 'administrador' && <th className="py-3 pr-4 font-medium">ID</th>}
                                    <th className="py-3 pr-4 font-medium">Título</th>
                                    <th className="py-3 pr-4 font-medium">Autor</th>
                                    <th className="py-3 pr-4 font-medium">ISBN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {libros.map(libro => (
                                    <tr key={libro.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        {rol === 'administrador' && <td className="py-3 pr-4 text-slate-800"><a className="font-medium text-sky-700 hover:text-sky-900" href={`/libros/${libro.id}`}>{libro.id}</a></td>}
                                        <td className="py-3 pr-4 text-slate-800">{libro.titulo}</td>
                                        <td className="py-3 pr-4 text-slate-600">{libro.autor}</td>
                                        <td className="py-3 pr-4 text-slate-600">{libro.isbn}</td>
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