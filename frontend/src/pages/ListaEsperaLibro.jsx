import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function ListaEsperaLibro(){
    const { libroId } = useParams();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/lista-espera/libro/${libroId}`)
            .then(res => setLista(res.data.data))
            .catch(err => setError(err.response?.data?.error || 'Error al cargar lista de espera'))
            .finally(() => setLoading(false));
    }, [libroId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Espera del libro</h1>
            <div className="bg-white rounded-xl shadow p-6">
                {lista.length === 0 ? (
                    <p className="text-gray-500">No hay usuarios en lista de espera para este libro.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-sky-100 text-gray-700">
                                    <th className="px-4 py-2 text-left">Usuario</th>
                                    <th className="px-4 py-2 text-left">Posición</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((e, i) => (
                                    <tr key={e.id} className="border-b hover:bg-sky-50">
                                        <td className="px-4 py-2">{e.usuario_nombre}</td>
                                        <td className="px-4 py-2">{e.posicion || i + 1}</td>
                                        <td className="px-4 py-2">{new Date(e.created_at).toLocaleDateString('es-MX')}</td>
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