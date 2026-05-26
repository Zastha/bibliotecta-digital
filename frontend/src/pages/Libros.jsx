import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Libros() {
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
        <section>
            <h1>Libros</h1>

            <h2>Nuevo libro</h2>
            <form onSubmit={crear}>
                <input placeholder="Título" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
                <input placeholder="Autor" value={form.autor} onChange={e => set('autor', e.target.value)} required />
                <input placeholder="ISBN" value={form.isbn} onChange={e => set('isbn', e.target.value)} required />
                <button type="submit">Crear</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? <p>Cargando...</p> : (
                <table>
                    <thead>
                        <tr>   
                            <th>ID</th>
                            <th>Titulo</th>
                            <th>Autor</th>
                            <th>ISBN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map(libro => (
                            <tr key={libro.id}>
                                 <td> <a href={`/libros/${libro.id}`}>{libro.id}</a></td>
                                <td>{libro.titulo}</td>
                                <td>{libro.autor}</td>
                                <td>{libro.isbn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}