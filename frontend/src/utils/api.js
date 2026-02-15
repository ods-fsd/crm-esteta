import axios from 'axios';

const api = axios.create({
    // Якщо є змінна середовища (на Vercel) - беремо її, якщо ні - локальний хост
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехоплювач запитів: додаємо токен
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Ми будемо зберігати токен під ключем 'token'
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Перехоплювач відповідей: обробка 401 (втрата авторизації)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Якщо токен прострочився — викидаємо юзера
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;