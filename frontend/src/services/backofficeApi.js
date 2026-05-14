import axios from 'axios';

const backofficeApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1',
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
  },
});

backofficeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('backoffice_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

backofficeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const wasAuthed = !!localStorage.getItem('backoffice_token');
      localStorage.removeItem('backoffice_token');

      const skipRedirect = error.config?.skipAuthRedirect === true;

      if (wasAuthed && !skipRedirect) {
        window.dispatchEvent(new CustomEvent('backoffice:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default backofficeApi;
