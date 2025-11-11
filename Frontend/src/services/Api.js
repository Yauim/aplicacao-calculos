import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Intercepta todas as requisições e adiciona o token JWT automaticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // <-- o JWT é salvo no login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
