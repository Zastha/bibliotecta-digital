import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ auth_id: '', nombre: '', email: '', rol: 'alumno' });

    const cargar = () => {
        setLoading(true);
        api.get('/usuarios')
            .then(res => setUsuarios(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
        <section>
            <h1>Usuarios</h1>

            <h2>Nuevo usuario</h2>
            <form onSubmit={crear}>
                <input placeholder="auth_id" value={form.auth_id} onChange={e => set('auth_id', e.target.value)} required />
                <input placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                <input placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
                <select value={form.rol} onChange={e => set('rol', e.target.value)}>
                    <option value="alumno">Alumno</option>
                    <option value="maestro">Maestro</option>
                    <option value="administrador">Administrador</option>
                </select>
                <button type="submit">Crear</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Cargando...</p> : (
                <table>
                    <thead>
                        <tr>   
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nombre}</td>
                                <td>{u.email}</td>
                                <td>{u.rol}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}