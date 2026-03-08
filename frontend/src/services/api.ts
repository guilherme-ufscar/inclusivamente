import axios from 'axios';

const api = axios.create({
    // VITE_API_URL can be set in a .env file locally for dev. Otherwise defaults to the production endpoint!
    baseURL: import.meta.env.VITE_API_URL || 'https://www.inclusivamenteeduca.com/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
