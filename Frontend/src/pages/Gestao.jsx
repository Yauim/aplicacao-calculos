import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell, // ✅ Import correto para colorir dinamicamente
} from "recharts";
import Toast from "../components/Toast";

function Gestao() {
    const [previsao, setPrevisao] = useState("");
    const [calculos, setCalculos] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [toast, setToast] = useState(null);

    // 🔁 Busca cálculos e histórico
    const calcular = async () => {
        try {
            setCarregando(true);
            const [resCalculos, resHistorico] = await Promise.all([
                api.get("/api/gestao/calculos"),
                api.get("/api/gestao/historico"),
            ]);
            setCalculos(resCalculos.data);
            setHistorico(resHistorico.data || []);
        } catch (err) {
            console.error("Erro ao buscar cálculos:", err);
            setToast({ message: "❌ Erro ao carregar cálculos!", type: "error" });
        } finally {
            setCarregando(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 💾 Salvar previsão de gastos
    const enviar = async (e) => {
        e.preventDefault();
        if (!previsao || isNaN(previsao)) return;
        try {
            await api.post("/api/gestao", {
                previsaoGastos: parseFloat(previsao),
            });
            setPrevisao("");
            setToast({ message: "✅ Previsão de gastos salva!", type: "success" });
            await calcular(); // ✅ Aguarda recalcular após salvar previsão
        } catch (err) {
            console.error("Erro ao salvar previsão:", err);
            setToast({ message: "❌ Erro ao salvar previsão!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 🗑️ Excluir histórico
    const apagarHistorico = async (id) => {
        if (!window.confirm("Deseja realmente excluir este registro?")) return;
        try {
            await api.delete(`/api/gestao/historico/${id}`);
            setHistorico((prev) => prev.filter((item) => item.id !== id));
            setToast({ message: "🗑️ Registro removido com sucesso!", type: "success" });
        } catch (err) {
            console.error("Erro ao excluir histórico:", err);
            setToast({ message: "❌ Erro ao excluir registro!", type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
        }
    };

    // 📄 Gerar PDF com gráfico e tabela
    const gerarPDF = async () => {
        if (!calculos) return;

        const doc = new jsPDF("p", "mm", "a4");

        // Cabeçalho
        doc.setFontSize(18);
        doc.text("Relatório de Gestão Financeira", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 25);

        // --- Tabela de indicadores ---
        const body = [
            ["PMRE", `${calculos.pmre.toFixed(2)} dias`],
            ["PMRV", `${calculos.pmrv.toFixed(2)} dias`],
            ["PMPF", `${calculos.pmpf.toFixed(2)} dias`],
            ["Ciclo Operacional", `${calculos.cicloOperacional.toFixed(2)} dias`],
            ["Ciclo de Caixa", `${calculos.cicloCaixa.toFixed(2)} dias`],
            ["Saldo Mínimo", `R$ ${calculos.saldoMinimo.toFixed(2)}`],
        ];

        autoTable(doc, {
            startY: 35,
            head: [["Indicador", "Valor"]],
            body,
            theme: "grid",
            headStyles: { fillColor: [123, 31, 162], textColor: 255 },
            bodyStyles: { valign: "middle" },
            styles: { fontSize: 10 },
        });

        // --- Captura o gráfico da tela ---
        const chartElement = document.querySelector(".grafico-gestao"); // <section className="grafico-gestao ...">
        if (chartElement) {
            const canvas = await html2canvas(chartElement, { scale: 2 }); // alta resolução
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const posY = doc.lastAutoTable.finalY + 10;

            doc.addImage(imgData, "PNG", 15, posY, imgWidth, imgHeight);

        }

        // --- Rodapé ---
        const h = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.text(
            "© 2025 Aplicação de Cálculos — Desenvolvido por Gabriel Paizante",
            105,
            h - 10,
            { align: "center" }
        );

        // Salvar
        doc.save(`gestao-${new Date().toISOString().split("T")[0]}.pdf`);
    };


    // 🧠 Análise automática
    const analise = () => {
        if (!calculos) return null;
        const { cicloCaixa } = calculos;
        if (cicloCaixa < 0)
            return {
                msg: "✅ Ciclo de Caixa negativo — empresa recebe antes de pagar (fluxo saudável).",
                cor: "text-green-600",
            };
        if (cicloCaixa < 15)
            return {
                msg: "⚠️ Ciclo de Caixa curto — atenção à liquidez.",
                cor: "text-yellow-600",
            };
        return {
            msg: "🔴 Ciclo de Caixa longo — risco de descasamento entre recebimentos e pagamentos.",
            cor: "text-red-600",
        };
    };

    useEffect(() => {
        calcular();
    }, []);

    // 🔢 Montagem dos dados do gráfico
    const dataChart = calculos
        ? [
            { nome: "PMRE", valor: calculos.pmre },
            { nome: "PMRV", valor: calculos.pmrv },
            { nome: "PMPF", valor: calculos.pmpf },
            { nome: "Ciclo Caixa", valor: calculos.cicloCaixa },
        ]
        : [];

    return (
        <div className="max-w-6xl mx-auto p-4">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                        📊 Gestão Financeira
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Análise automatizada de prazos e saldos
                    </p>
                </div>
                <button
                    onClick={gerarPDF}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md shadow hover:opacity-90 transition"
                >
                    🧾 Gerar PDF
                </button>
            </header>

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

            {carregando && (
                <p className="text-center text-gray-500 animate-pulse">
                    Carregando dados...
                </p>
            )}

            {calculos && (
                <>
                    {/* Indicadores */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-purple-50 rounded-2xl shadow border border-purple-200">
                            <h3 className="text-lg font-semibold text-purple-700 mb-2">
                                📈 Indicadores de Prazo
                            </h3>
                            <ul className="space-y-1 text-gray-800">
                                <li><b>PMRE:</b> {calculos.pmre.toFixed(2)} dias</li>
                                <li><b>PMRV:</b> {calculos.pmrv.toFixed(2)} dias</li>
                                <li><b>PMPF:</b> {calculos.pmpf.toFixed(2)} dias</li>
                            </ul>
                        </div>

                        <div className="p-6 bg-purple-50 rounded-2xl shadow border border-purple-200">
                            <h3 className="text-lg font-semibold text-purple-700 mb-2">
                                💰 Ciclos e Saldo
                            </h3>
                            <ul className="space-y-1 text-gray-800">
                                <li><b>Ciclo Operacional:</b> {calculos.cicloOperacional.toFixed(2)} dias</li>
                                <li><b>Ciclo de Caixa:</b> {calculos.cicloCaixa.toFixed(2)} dias</li>
                                <li><b>Saldo Mínimo:</b> R$ {calculos.saldoMinimo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Gráfico colorido */}
                    <section className="grafico-gestao mt-8 bg-white p-6 rounded-2xl shadow border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            📊 Visualização Gráfica
                        </h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={dataChart}>
                                <XAxis dataKey="nome" />
                                <YAxis />
                                <Tooltip formatter={(v) => `${v.toFixed(2)} dias`} />
                                <Legend />
                                <Bar dataKey="valor" radius={[10, 10, 0, 0]} isAnimationActive={true}>
                                    {dataChart.map((entry, index) => {
                                        let color = "#8B5CF6"; // 🟣 padrão
                                        if (entry.nome === "Ciclo Caixa") {
                                            color = entry.valor < 0 ? "#10b981" : "#ef4444"; // ✅ verde se NEGATIVO, vermelho se POSITIVO
                                        }
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-sm text-gray-500 mt-2">
                            <span className="text-purple-600 font-semibold">🟣</span> Indicador comum &nbsp;|&nbsp;
                            <span className="text-green-600 font-semibold">🟢</span> Ciclo de Caixa negativo (fluxo saudável) &nbsp;|&nbsp;
                            <span className="text-red-500 font-semibold">🔴</span> Ciclo de Caixa positivo (atenção)
                        </p>
                    </section>

                    {/* Análise automática */}
                    {analise() && (
                        <div className={`mt-6 p-4 rounded-xl border ${analise().cor} border-opacity-30`}>
                            <h4 className="font-semibold mb-2">🧠 Análise Automática</h4>
                            <p>{analise().msg}</p>
                        </div>
                    )}

                    {/* Histórico */}
                    {historico.length > 0 && (
                        <section className="mt-8 bg-white p-6 rounded-2xl shadow border overflow-auto">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">📅 Histórico de Indicadores</h3>
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                <tr className="bg-purple-100 text-purple-700">
                                    <th className="p-2 border">Data</th>
                                    <th className="p-2 border">Ciclo Caixa</th>
                                    <th className="p-2 border">Saldo Mínimo</th>
                                    <th className="p-2 border text-center">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {historico.map((h) => (
                                    <tr key={h.id} className="odd:bg-purple-50 hover:bg-purple-100 transition">
                                        <td className="p-2 border">
                                            {new Date(h.dataCalculo).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="p-2 border">{h.cicloCaixa.toFixed(2)} dias</td>
                                        <td className="p-2 border">
                                            R${h.saldoMinimo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-2 border text-center">
                                            <button
                                                onClick={() => apagarHistorico(h.id)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                title="Excluir registro"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

export default Gestao;
