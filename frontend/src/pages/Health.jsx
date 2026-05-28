import {useState, useEffect} from 'react';
import api from '../services/api';

function Health(){
    const [status, setStatus] = useState(null);

    useEffect(() => {

        api.get('/health')
        .then(response => setStatus(response.data))
        .catch(error => setStatus({status: 'error',message:error.message}));
    },[]);

    return (
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Sistema</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Estado del Servidor</h1>
                <p className="mt-4 text-base text-slate-600">{status ? status.message : 'Conectando...'}</p>
            </div>
        </section>
    )
}

export default Health;