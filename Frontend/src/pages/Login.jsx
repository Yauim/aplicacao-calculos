import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import Toast from "../components/Toast";

function Login() {
    const [toast, setToast] = useState(null);

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const userInfo = jwtDecode(token);

            console.log("Usuário Google:", userInfo);

            const res = await api.post("/auth/google", { token });
            const jwt = res.data.jwt;

            localStorage.setItem("jwt", jwt);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("nome", res.data.nome);

            setToast({ message: "✅ Login realizado com sucesso!", type: "success" });

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (err) {
            console.error("Erro ao autenticar:", err);
            setToast({ message: "❌ Falha na autenticação com o Google!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleLoginError = () => {
        setToast({ message: "❌ Erro ao fazer login com o Google!", type: "error" });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {toast && <Toast message={toast.message} type={toast.type} />}
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    🔐 Login com Google
                </h1>
                <p className="text-gray-500 mb-6">
                    Acesse sua conta para continuar.
                </p>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
