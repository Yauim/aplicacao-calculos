import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/checkTokenExpiration";

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("jwt");

    // ❌ Se não tem token ou está expirado → desloga e redireciona
    if (!token || isTokenExpired()) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("email");
        localStorage.removeItem("nome");
        return <Navigate to="/login" />;
    }

    // ✅ Se estiver tudo certo, mostra o conteúdo da rota
    return children;
}
