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
    if (!libro) return <p>{error}</p>;

    return (
        <section>
            <h1>Detalle de Libro</h1>
            <p><strong>ID:</strong> {libro.id}</p>
            <p><strong>Titulo:</strong> {libro.titulo}</p>
            <p><strong>Autor:</strong> {libro.autor}</p>
            <p><strong>ISBN:</strong> {libro.isbn}</p>

            <h2>Editar</h2>
            <form onSubmit={actualizar}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {ok && <p style={{ color: 'green' }}>{ok}</p>}
                <input placeholder="ID" value={form.id} onChange={e => set('id', e.target.value)} />
                <input placeholder="Titulo" value={form.titulo} onChange={e => set('titulo', e.target.value)} />
                <input placeholder="Autor" value={form.autor} onChange={e => set('autor', e.target.value)} />
                <input placeholder="ISBN" value={form.isbn} onChange={e => set('isbn', e.target.value)} />
                <button type="submit">Actualizar</button>
            </form>
            <button onClick={eliminar} style={{ color: 'red' }}>Eliminar libro</button>
        </section>
    );
}
