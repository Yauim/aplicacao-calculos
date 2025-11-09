import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ IMPORT CORRETO
import Toast from "../components/Toast"; // ✅ componente de feedback visual

function Vendas() {
    const [vendas, setVendas] = useState([]);
    const [nova, setNova] = useState({
        dataVenda: "",
        cliente: "",
        produto: "",
        precoVenda: "",
        prazoPagto: "",
    });
    const [carregando, setCarregando] = useState(false);
    const [toast, setToast] = useState(null);

    // 🔁 Carregar vendas
    const carregar = async () => {
        try {
            setCarregando(true);
            const res = await api.get("/api/vendas");
            setVendas(res.data);
        } catch (err) {
            console.error("Erro ao carregar vendas:", err);
            setToast({ message: "❌ Erro ao carregar vendas!", type: "error" });
        } finally {
            setCarregando(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    // 💾 Enviar nova venda
    const enviar = async (e) => {
        e.preventDefault();
        try {
            setCarregando(true);
            await api.post("/api/vendas", nova);
            setNova({
                dataVenda: "",
                cliente: "",
                produto: "",
                precoVenda: "",
                prazoPagto: "",
            });
            carregar();
            setToast({ message: "✅ Venda registrada com sucesso!", type: "success" });
        } catch (err) {
            console.error("Erro ao registrar venda:", err);
            setToast({ message: "❌ Erro ao registrar venda!", type: "error" });
        } finally {
            setCarregando(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    // ❌ Excluir venda
    const excluir = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta venda?")) return;
        try {
            await api.delete(`/api/vendas/${id}`);
            carregar();
            setToast({ message: "🗑️ Venda excluída com sucesso!", type: "info" });
        } catch (err) {
            console.error("Erro ao excluir venda:", err);
            setToast({ message: "❌ Erro ao excluir venda!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 📄 Gerar PDF com jsPDF + autoTable
    const gerarPDF = () => {
        if (vendas.length === 0) {
            setToast({ message: "⚠️ Nenhuma venda para gerar PDF!", type: "info" });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const doc = new jsPDF();

        // 🏷️ Cabeçalho
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Vendas", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 25);

        // 📊 Tabela formatada
        autoTable(doc, {
            startY: 35,
            head: [["ID", "Data", "Cliente", "Produto", "Preço (R$)", "Prazo (dias)"]],
            body: vendas.map((v) => [
                v.id,
                v.dataVenda,
                v.cliente,
                v.produto,
                Number(v.precoVenda).toFixed(2),
                v.prazoPagto,
            ]),
            theme: "grid",
            headStyles: {
                fillColor: [46, 125, 50], // Verde Tailwind
                textColor: 255,
                fontStyle: "bold",
            },
            bodyStyles: { textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { halign: "center" },
        });

        // 📝 Rodapé
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text(
            "© 2025 Aplicação de Cálculos — Desenvolvido por Gabriel Paizante",
            105,
            pageHeight - 10,
            { align: "center" }
        );

        // 💾 Salva o PDF
        doc.save(`relatorio-vendas-${new Date().toISOString().split("T")[0]}.pdf`);

        setToast({ message: "📄 PDF de Vendas gerado com sucesso!", type: "success" });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                    💸 Vendas
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
                    value={nova.dataVenda}
                    onChange={(e) => setNova({ ...nova, dataVenda: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Cliente"
                    value={nova.cliente}
                    onChange={(e) => setNova({ ...nova, cliente: e.target.value })}
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
                    placeholder="Preço de Venda"
                    value={nova.precoVenda}
                    onChange={(e) => setNova({ ...nova, precoVenda: e.target.value })}
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
                <button
                    className="bg-green-600 text-white p-2 rounded-md col-span-2 md:col-span-3 hover:bg-green-700 transition"
                    disabled={carregando}
                >
                    {carregando ? "Salvando..." : "Registrar Venda"}
                </button>
            </form>

            {/* Tabela */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-green-100 text-green-800 font-semibold">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Data</th>
                        <th className="border p-2">Cliente</th>
                        <th className="border p-2">Produto</th>
                        <th className="border p-2">Preço</th>
                        <th className="border p-2">Prazo</th>
                        <th className="border p-2">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {carregando ? (
                        <tr>
                            <td colSpan="7" className="text-center p-4 text-gray-500">
                                Carregando vendas...
                            </td>
                        </tr>
                    ) : vendas.length > 0 ? (
                        vendas.map((v) => (
                            <tr key={v.id} className="border-t text-center hover:bg-gray-50">
                                <td className="p-2">{v.id}</td>
                                <td className="p-2">{v.dataVenda}</td>
                                <td className="p-2">{v.cliente}</td>
                                <td className="p-2">{v.produto}</td>
                                <td className="p-2">R$ {Number(v.precoVenda).toFixed(2)}</td>
                                <td className="p-2">{v.prazoPagto} dias</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => excluir(v.id)}
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
                                Nenhuma venda registrada ainda.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Vendas;
