import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
    'auth-id': 'test-admin-001' // cambiar según el rol que quieran probar
  }
});

export default api;