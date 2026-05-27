import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
    'auth-id': 'test-alumno-001' // cambiar según el rol que quieran probar
  }
});

//export const AUTH_ID = 'test-alumno-001'; // 
export const UUID = '870ae30a-35b7-4162-9946-0c9eab4d15d4'; // UUID del usuario

export const AUTH_ID = 'auth-alumno-001'; // 
//export const UUID = '5befd685-163f-49aa-bc6e-de3eba67e2ab'; // UUID del administrador

export const ROL = 'alumno'; // cambiar según el rol que quieran probar
export default api;