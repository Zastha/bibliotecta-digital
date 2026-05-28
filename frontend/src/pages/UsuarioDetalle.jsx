import { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UsuarioDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [form, setForm] = useState({ nombre: '', email: '', rol: 'alumno' });

    useEffect(() => {
        api.get(`/usuarios/${id}`)
            .then(res => {
                const u = res.data.data;
                setUsuario(u);
                setForm({ nombre: u.nombre, email: u.email, rol: u.rol });
            })
            .catch(err => setError(err.response?.data?.error || 'Error al cargar usuario'))
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
            await api.patch(`/usuarios/${id}`, form);
            setOk('Usuario actualizado correctamente');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar');
        }
    };

    const eliminar = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
        await api.delete(`/usuarios/${id}`);
        navigate('/usuarios');
    } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar');
    }
};

    if (loading) return <p>Cargando...</p>;
    if (!usuario) return <p className="px-4 py-8 text-sm text-red-600">{error}</p>;

    return (
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Perfil</p>
                <h1 className="text-3xl font-bold text-slate-900">Detalle de Usuario</h1>
            </div>

            <div className={`${cardClass} mb-6 grid gap-4 sm:grid-cols-2`}>
                <p><span className="font-semibold text-slate-900">Auth ID:</span> <span className="text-slate-600">{usuario.auth_id}</span></p>
                <p><span className="font-semibold text-slate-900">Creado:</span> <span className="text-slate-600">{new Date(usuario.created_at).toLocaleDateString('es-MX')}</span></p>
            </div>

            <div className={cardClass}>
                <h2 className="text-lg font-semibold text-slate-900">Editar</h2>
                <form onSubmit={actualizar} className="mt-4 space-y-4">
                    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    {ok && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}
                    <input className={inputClass} placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
                    <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                    <select className={inputClass} value={form.rol} onChange={e => set('rol', e.target.value)}>
                        <option value="alumno">Alumno</option>
                        <option value="maestro">Maestro</option>
                        <option value="administrador">Administrador</option>
                    </select>
                    <div className="flex flex-wrap gap-3">
                        <button type="submit" className={primaryButtonClass}>Actualizar</button>
                        <button onClick={eliminar} type="button" className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-medium text-red-700 transition hover:bg-red-100">Eliminar usuario</button>
                    </div>
                </form>
            </div>
        </section>
    );
}