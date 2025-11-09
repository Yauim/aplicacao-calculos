import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Toast from "../components/Toast"; // ✅ novo componente para feedback visual

function Entradas() {
    const [entradas, setEntradas] = useState([]);
    const [nova, setNova] = useState({
        dataEntrada: "",
        fornecedor: "",
        produto: "",
        precoCompra: "",
        prazoPagto: "",
    });
    const [toast, setToast] = useState(null); // ✅ estado do toast

    // 🔁 Função para carregar as entradas do backend
    const carregar = async () => {
        try {
            const res = await api.get("/api/entradas"); // ✅ prefixo /api
            setEntradas(res.data);
        } catch (err) {
            console.error("Erro ao carregar entradas:", err);
            setToast({ message: "❌ Erro ao carregar dados!", type: "error" });
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 🔁 Carrega ao iniciar a tela
    useEffect(() => {
        carregar();
    }, []);

    // 📨 Enviar nova entrada
    const enviar = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/entradas", nova); // ✅ prefixo /api
            setNova({
                dataEntrada: "",
                fornecedor: "",
                produto: "",
                precoCompra: "",
                prazoPagto: "",
            });
            carregar(); // atualiza a tabela
            setToast({ message: "✅ Entrada adicionada com sucesso!", type: "success" });
        } catch (err) {
            console.error("Erro ao salvar entrada:", err);
            setToast({ message: "❌ Erro ao salvar entrada!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // ❌ Excluir entrada
    const excluir = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta entrada?")) return;
        try {
            await api.delete(`/api/entradas/${id}`); // ✅ prefixo /api
            carregar();
            setToast({ message: "🗑️ Entrada excluída com sucesso!", type: "info" });
        } catch (err) {
            console.error("Erro ao excluir entrada:", err);
            setToast({ message: "❌ Erro ao excluir entrada!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 📄 Gerar PDF com jsPDF
    const gerarPDF = () => {
        if (entradas.length === 0) {
            setToast({ message: "⚠️ Nenhuma entrada para gerar PDF!", type: "info" });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const doc = new jsPDF();

        // 🏷️ Cabeçalho
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Entradas", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 25);

        // 📊 Tabela formatada
        autoTable(doc, {
            startY: 35,
            head: [["ID", "Data", "Fornecedor", "Produto", "Preço (R$)", "Prazo (dias)"]],
            body: entradas.map((e) => [
                e.id,
                e.dataEntrada,
                e.fornecedor,
                e.produto,
                Number(e.precoCompra).toFixed(2),
                e.prazoPagto,
            ]),
            theme: "grid",
            headStyles: {
                fillColor: [30, 64, 175], // Azul Tailwind
                textColor: 255,
                fontStyle: "bold",
            },
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { halign: "center" },
        });

        // 📝 Rodapé com assinatura
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text(
            "© 2025 Aplicação de Cálculos — Desenvolvido por Gabriel Paizante",
            105,
            pageHeight - 10,
            { align: "center" }
        );

        // 💾 Salvar o PDF
        doc.save(`relatorio-entradas-${new Date().toISOString().split("T")[0]}.pdf`);

        setToast({ message: "📄 PDF de Entradas gerado com sucesso!", type: "success" });
        setTimeout(() => setToast(null), 3000);
    };


    return (
        <div className="max-w-6xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} />} {/* ✅ Toast visual */}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                    📦 Entradas de Produtos
                </h2>
                <button
                    onClick={gerarPDF}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    📄 Gerar PDF
                </button>
            </div>

            {/* Formulário */}
            <form
                onSubmit={enviar}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-2xl shadow-md border"
            >
                <input
                    type="date"
                    value={nova.dataEntrada}
                    onChange={(e) => setNova({ ...nova, dataEntrada: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Fornecedor"
                    value={nova.fornecedor}
                    onChange={(e) => setNova({ ...nova, fornecedor: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Produto"
                    value={nova.produto}
                    onChange={(e) => setNova({ ...nova, produto: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Preço de Compra"
                    value={nova.precoCompra}
                    onChange={(e) => setNova({ ...nova, precoCompra: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Prazo Pagamento (dias)"
                    value={nova.prazoPagto}
                    onChange={(e) => setNova({ ...nova, prazoPagto: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <button className="bg-blue-600 text-white p-2 rounded-md col-span-2 md:col-span-3 hover:bg-blue-700 transition">
                    ➕ Adicionar
                </button>
            </form>

            {/* Tabela */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-blue-100 text-blue-800 font-semibold">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Data</th>
                        <th className="border p-2">Fornecedor</th>
                        <th className="border p-2">Produto</th>
                        <th className="border p-2">Preço</th>
                        <th className="border p-2">Prazo</th>
                        <th className="border p-2">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {entradas.length > 0 ? (
                        entradas.map((e) => (
                            <tr key={e.id} className="border-t text-center hover:bg-gray-50">
                                <td className="p-2">{e.id}</td>
                                <td className="p-2">{e.dataEntrada}</td>
                                <td className="p-2">{e.fornecedor}</td>
                                <td className="p-2">{e.produto}</td>
                                <td className="p-2">R$ {Number(e.precoCompra).toFixed(2)}</td>
                                <td className="p-2">{e.prazoPagto} dias</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => excluir(e.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center p-4 text-gray-500">
                                Nenhuma entrada registrada ainda.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Entradas;
