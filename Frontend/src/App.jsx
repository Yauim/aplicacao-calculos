import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Entradas from "./pages/Entradas";
import Vendas from "./pages/Vendas";
import Gestao from "./pages/Gestao";
import Login from "./pages/Login";

function App() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("jwt");

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("email");
        localStorage.removeItem("nome");
        navigate("/login");
    };

    const nome = localStorage.getItem("nome");

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* 🔹 Header só aparece se o usuário estiver logado */}
            {isAuthenticated && (
                <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
                    <h1 className="font-bold text-lg">🏪 Aplicação de Cálculos</h1>
                    <nav className="space-x-6 flex items-center">
                        <Link to="/">Entradas</Link>
                        <Link to="/vendas">Vendas</Link>
                        <Link to="/gestao">Gestão</Link>

                        {/* Mostra nome e botão de sair */}
                        {nome && <span className="text-sm text-gray-200 ml-4">👤 {nome}</span>}
                        <button
                            onClick={handleLogout}
                            className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                        >
                            Sair
                        </button>
                    </nav>
                </header>
            )}

            {/* 🔹 Conteúdo principal */}
            <main className="flex-1 p-8 container mx-auto">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <Routes>
                        {/* Rota de login */}
                        <Route
                            path="/login"
                            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                        />

                        {/* Rotas protegidas */}
                        <Route
                            path="/"
                            element={<PrivateRoute><Entradas /></PrivateRoute>}
                        />
                        <Route
                            path="/vendas"
                            element={<PrivateRoute><Vendas /></PrivateRoute>}
                        />
                        <Route
                            path="/gestao"
                            element={<PrivateRoute><Gestao /></PrivateRoute>}
                        />

                        {/* Qualquer outra rota redireciona pro login */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </main>

            {/* 🔹 Footer */}
            {isAuthenticated && (
                <footer className="text-center p-4 bg-gray-100 text-gray-500 text-sm">
                    © {new Date().getFullYear()} Aplicação de Cálculos — Desenvolvido por Gabriel Paizante
                </footer>
            )}
        </div>
    );
}

export default App;
