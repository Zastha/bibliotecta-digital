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
    if (!usuario) return <p>{error}</p>;

    return (
        <section>
            <h1>Detalle de Usuario</h1>
            <p><strong>Auth ID:</strong> {usuario.auth_id}</p>
            <p><strong>Creado:</strong> {new Date(usuario.created_at).toLocaleDateString('es-MX')}</p>

            <h2>Editar</h2>
            <form onSubmit={actualizar}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {ok && <p style={{ color: 'green' }}>{ok}</p>}
                <input placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
                <input placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                <select value={form.rol} onChange={e => set('rol', e.target.value)}>
                    <option value="alumno">Alumno</option>
                    <option value="maestro">Maestro</option>
                    <option value="administrador">Administrador</option>
                </select>
                <button type="submit">Actualizar</button>
            </form>
            <button onClick={eliminar} style={{ color: 'red' }}>Eliminar usuario</button>
        </section>
    );
}