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
        <div>
            <h1>Estado del Servidor</h1>
            {status ? (<p>{status.message}</p>):(<p>Conectando...</p>)}

        </div>
    )
}

export default Health;