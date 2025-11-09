import { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ IMPORT CORRETO
import Toast from "../components/Toast"; // ✅ feedback visual

function Gestao() {
    const [previsao, setPrevisao] = useState("");
    const [calculos, setCalculos] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [toast, setToast] = useState(null);

    // 🔁 Buscar cálculos do backend
    const calcular = async () => {
        try {
            setCarregando(true);
            const res = await api.get("/api/gestao/calculos");
            setCalculos(res.data);
        } catch (err) {
            console.error("Erro ao buscar cálculos:", err);
            setToast({ message: "❌ Erro ao carregar cálculos!", type: "error" });
        } finally {
            setCarregando(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 💾 Enviar previsão de gastos
    const enviar = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/gestao", { previsaoGastos: parseFloat(previsao) });
            setPrevisao("");
            setToast({ message: "✅ Previsão de gastos salva com sucesso!", type: "success" });
            calcular();
        } catch (err) {
            console.error("Erro ao salvar previsão:", err);
            setToast({ message: "❌ Erro ao salvar previsão!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 📄 Gerar PDF dos cálculos
    const gerarPDF = () => {
        if (!calculos) {
            setToast({
                message: "⚠️ Nenhum cálculo disponível para gerar PDF!",
                type: "info",
            });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const doc = new jsPDF();

        // 🏷️ Cabeçalho
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Gestão Financeira", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 25);

        // 📊 Dados da tabela
        const head = [["Indicador", "Valor"]];
        const body = [
            ["PMRE (Prazo Médio de Renovação de Estoques)", `${calculos.pmre.toFixed(2)} dias`],
            ["PMRV (Prazo Médio de Recebimento de Vendas)", `${calculos.pmrv.toFixed(2)} dias`],
            ["PMPF (Prazo Médio de Pagamento a Fornecedores)", `${calculos.pmpf.toFixed(2)} dias`],
            ["Ciclo Operacional", `${calculos.cicloOperacional.toFixed(2)} dias`],
            ["Ciclo de Caixa", `${calculos.cicloCaixa.toFixed(2)} dias`],
            ["Saldo Mínimo de Caixa", `R$ ${calculos.saldoMinimo.toFixed(2)}`],
        ];

        // ✅ Usando autoTable corretamente
        autoTable(doc, {
            startY: 35,
            head,
            body,
            theme: "grid",
            headStyles: {
                fillColor: [123, 31, 162], // Roxo elegante
                textColor: 255,
                fontStyle: "bold",
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            styles: {
                halign: "center",
            },
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
        doc.save(`relatorio-gestao-${new Date().toISOString().split("T")[0]}.pdf`);

        // ✅ Toast de sucesso
        setToast({ message: "📄 PDF de Gestão gerado com sucesso!", type: "success" });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        calcular();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                    📊 Gestão Financeira
                </h2>
                <button
                    onClick={gerarPDF}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    📄 Gerar PDF
                </button>
            </div>

            {/* Formulário de previsão */}
            <form
                onSubmit={enviar}
                className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-md border"
            >
                <input
                    type="number"
                    step="0.01"
                    placeholder="Previsão de Gastos (R$)"
                    value={previsao}
                    onChange={(e) => setPrevisao(e.target.value)}
                    className="border p-2 rounded w-full sm:w-64"
                    required
                />
                <button
                    className="bg-purple-600 text-white rounded px-6 py-2 hover:bg-purple-700 transition"
                    disabled={carregando}
                >
                    {carregando ? "Salvando..." : "Salvar Previsão"}
                </button>
            </form>

            {/* Exibição dos cálculos */}
            {carregando && (
                <p className="text-gray-500 animate-pulse text-center">
                    Carregando cálculos...
                </p>
            )}

            {calculos && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-purple-50 rounded-2xl shadow-md border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-700 mb-2">
                            📈 Indicadores de Prazo
                        </h3>
                        <p><b>PMRE:</b> {calculos.pmre.toFixed(2)} dias</p>
                        <p><b>PMRV:</b> {calculos.pmrv.toFixed(2)} dias</p>
                        <p><b>PMPF:</b> {calculos.pmpf.toFixed(2)} dias</p>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-2xl shadow-md border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-700 mb-2">
                            💰 Ciclos e Saldo
                        </h3>
                        <p><b>Ciclo Operacional:</b> {calculos.cicloOperacional.toFixed(2)} dias</p>
                        <p><b>Ciclo de Caixa:</b> {calculos.cicloCaixa.toFixed(2)} dias</p>
                        <p><b>Saldo Mínimo:</b> R$ {calculos.saldoMinimo.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {!carregando && !calculos && (
                <p className="text-gray-500 text-center mt-4">
                    Nenhum cálculo disponível ainda. Informe uma previsão de gastos para iniciar.
                </p>
            )}
        </div>
    );
}

export default Gestao;
