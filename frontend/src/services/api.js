import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: añade el JWT a cada petición (si existe)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: si el token expira (401), limpia y redirige a login
// Excepción: rutas /auth/admin/** no deben cerrar la sesión (son errores de permiso del backend)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isAdminRoute = url.startsWith('/auth/admin') || url.startsWith('/api/subscriptions/all');
        if (error.response && error.response.status === 401 && !isAdminRoute) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;