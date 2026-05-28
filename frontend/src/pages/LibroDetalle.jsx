import { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LibroDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [libro, setLibro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [form, setForm] = useState({titulo: '', autor: '', isbn: ''});

    useEffect(() => {
        api.get(`/libros/${id}`)
            .then(res => {
                const l = res.data.data;
                setLibro(l);
                setForm({id: l.id, titulo: l.titulo, autor: l.autor, isbn: l.isbn });
            })
            .catch(err => setError(err.response?.data?.error || 'Error al cargar libro'))
            .finally(() => setLoading(false));
    }, [id]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200';
    const cardClass = 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm';
    const primaryButtonClass = 'inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700';

    
    const actualizar = async (e) => {
        e.preventDefault();
        setError(''); setOk('');
        try {
            await api.patch(`/libros/${id}`, form);
            setOk('Libro actualizado correctamente');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar');
        }
    };

    const eliminar = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar este libro?')) return;
    try {
        await api.delete(`/libros/${id}`);
        navigate('/libros');
    } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar');
    }
};

    if (loading) return <p>Cargando...</p>;
    if (!libro) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;

    return (
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Detalle</p>
                <h1 className="text-3xl font-bold text-slate-900">Detalle de Libro</h1>
            </div>

            <div className={`${cardClass} mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
                <p><span className="font-semibold text-slate-900">ID:</span> <span className="text-slate-600">{libro.id}</span></p>
                <p><span className="font-semibold text-slate-900">Título:</span> <span className="text-slate-600">{libro.titulo}</span></p>
                <p><span className="font-semibold text-slate-900">Autor:</span> <span className="text-slate-600">{libro.autor}</span></p>
                <p><span className="font-semibold text-slate-900">ISBN:</span> <span className="text-slate-600">{libro.isbn}</span></p>
            </div>

            <div className={cardClass}>
                <h2 className="text-lg font-semibold text-slate-900">Editar</h2>
                <form onSubmit={actualizar} className="mt-4 space-y-4">
                    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    {ok && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}
                    <input className={inputClass} placeholder="ID" value={form.id} onChange={e => set('id', e.target.value)} />
                    <input className={inputClass} placeholder="Título" value={form.titulo} onChange={e => set('titulo', e.target.value)} />
                    <input className={inputClass} placeholder="Autor" value={form.autor} onChange={e => set('autor', e.target.value)} />
                    <input className={inputClass} placeholder="ISBN" value={form.isbn} onChange={e => set('isbn', e.target.value)} />
                    <div className="flex flex-wrap gap-3">
                        <button type="submit" className={primaryButtonClass}>Actualizar</button>
                        <button onClick={eliminar} type="button" className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-medium text-red-700 transition hover:bg-red-100">Eliminar libro</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
