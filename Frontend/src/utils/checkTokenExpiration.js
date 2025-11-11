import { jwtDecode } from "jwt-decode";

export function isTokenExpired() {
    const token = localStorage.getItem("jwt");
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);

        // `exp` é o timestamp de expiração em segundos
        const now = Date.now() / 1000;
        return decoded.exp < now; // true se expirado
    } catch (err) {
        console.error("Erro ao verificar expiração do token:", err);
        return true; // Se algo der errado, trata como expirado
    }
}
