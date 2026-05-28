import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const setAuthId = (authId) => {
  if (authId) {
    api.defaults.headers.common['auth-id'] = authId;
  } else {
    delete api.defaults.headers.common['auth-id'];
  }
};

export default api;