import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Entradas from "./pages/Entradas";
import Vendas from "./pages/Vendas";
import Gestao from "./pages/Gestao";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
                    <h1 className="font-bold text-lg">🏪 Aplicação de Cálculos</h1>
                    <nav className="space-x-6">
                        <Link to="/" className="hover:underline">Entradas</Link>
                        <Link to="/vendas" className="hover:underline">Vendas</Link>
                        <Link to="/gestao" className="hover:underline">Gestão</Link>
                    </nav>
                </header>

                <main className="flex-1 p-8 container mx-auto">
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <Routes>
                            <Route path="/" element={<Entradas />} />
                            <Route path="/vendas" element={<Vendas />} />
                            <Route path="/gestao" element={<Gestao />} />
                        </Routes>
                    </div>
                </main>

                <footer className="text-center p-4 bg-gray-100 text-gray-500 text-sm">
                    © {new Date().getFullYear()} Aplicação de Cálculos — Desenvolvido por Gabriel Paizante
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
