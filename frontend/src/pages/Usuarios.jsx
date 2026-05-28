import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ auth_id: '', nombre: '', email: '', rol: 'alumno' });
    const [busqueda, setBusqueda] = useState('');

    const cargar = () => {
        setLoading(true);
        api.get('/usuarios')
            .then(res => setUsuarios(res.data.data))
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
            await api.post('/usuarios', form);
            setForm({ auth_id: '', nombre: '', email: '', rol: 'alumno' });
            cargar();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear usuario');
        }
    };

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Administración</p>
                <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
                <p className="text-sm text-slate-600">Crea cuentas y filtra usuarios registrados.</p>
            </div>

            <div className={`${cardClass} mb-6`}>
                <h2 className="text-lg font-semibold text-slate-900">Nuevo usuario</h2>
                <form onSubmit={crear} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <input className={inputClass} placeholder="auth_id" value={form.auth_id} onChange={e => set('auth_id', e.target.value)} required />
                    <input className={inputClass} placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                    <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
                    <select className={inputClass} value={form.rol} onChange={e => set('rol', e.target.value)}>
                        <option value="alumno">Alumno</option>
                        <option value="maestro">Maestro</option>
                        <option value="administrador">Administrador</option>
                    </select>
                    <button type="submit" className={primaryButtonClass}>Crear</button>
                </form>
            </div>

            <input
                className="mb-6 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
            />

            {error && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className={cardClass}>
                {loading ? <p className="text-sm text-slate-500">Cargando...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-3 pr-4 font-medium">ID</th>
                                    <th className="py-3 pr-4 font-medium">Nombre</th>
                                    <th className="py-3 pr-4 font-medium">Email</th>
                                    <th className="py-3 pr-4 font-medium">Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios
                                    .filter(u =>
                                        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                                        u.email?.toLowerCase().includes(busqueda.toLowerCase())
                                    )
                                    .map(u => (
                                        <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                            <td className="py-3 pr-4 text-slate-800"><a className="font-medium text-sky-700 hover:text-sky-900" href={`/usuarios/${u.id}`}>{u.auth_id}</a></td>
                                            <td className="py-3 pr-4 text-slate-800">{u.nombre}</td>
                                            <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                                            <td className="py-3 pr-4 text-slate-600">{u.rol}</td>
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