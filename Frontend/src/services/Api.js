import axios from "axios";

const api = axios.create({
    baseURL: "/api", // ✅ o Vite vai redirecionar automaticamente para o Spring Boot (8080)
});

export default api;
