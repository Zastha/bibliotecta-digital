import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function ListaEsperaUsuario() {
    const { usuarioId } = useParams();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');


    const cargar = () => {
        setLoading(true);
        api.get(`/lista-espera/usuario/${usuarioId}`)
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {cargar()}, []);

    const salir = async (usuarioId, libroId) => {
    if (!window.confirm('¿Salir de la lista de espera?')) return;
    setError(''); setOk('');
    try {
        await api.patch('/lista-espera/desactivar', { usuarioId, libroId });
        setOk('Saliste de la lista de espera');
        cargar();
    } catch (err) {
        setError(err.response?.data?.error || 'Error al salir');
    }
};

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (ok) return <p style={{ color: 'green' }}>{ok}</p>;

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Espera</h1>
            <div className="bg-white rounded-xl shadow p-6">
                {lista.length === 0 ? (
                    <p className="text-gray-500">No está en ninguna lista de espera.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-sky-100 text-gray-700">
                                    <th className="px-4 py-2 text-left">Libro</th>
                                    <th className="px-4 py-2 text-left">Posición</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id || i} className="border-b hover:bg-sky-50">
                                        <td className="px-4 py-2">{e.libro_titulo}</td>
                                        <td className="px-4 py-2">{e.posicion || i + 1}</td>
                                        <td className="px-4 py-2">{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button onClick={() => salir(e.usuario_id, e.libro_id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">Salir</button>
                                        </td>
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