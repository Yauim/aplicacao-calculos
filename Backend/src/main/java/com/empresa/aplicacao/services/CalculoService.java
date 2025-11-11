package com.empresa.aplicacao.services;

import com.empresa.aplicacao.models.Entrada;
import com.empresa.aplicacao.models.Venda;
import com.empresa.aplicacao.repositories.EntradaRepository;
import com.empresa.aplicacao.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Serviço responsável pelos cálculos financeiros da aplicação.
 * Alinhado com o PDF "Trabalho - Sistema de Informações Gerenciais"
 * Autor: Gabriel Paizante
 */
@Service
public class CalculoService {

    @Autowired
    private EntradaRepository entradaRepository;

    @Autowired
    private VendaRepository vendaRepository;

    // ---------------------------
    // --- FUNÇÕES EXISTENTES ---
    // ---------------------------

    public double calcularPMRE() {
        List<Entrada> entradas = entradaRepository.findAll();
        List<Venda> vendas = vendaRepository.findAll();

        double totalDias = 0;
        int contador = 0;

        for (Entrada entrada : entradas) {
            for (Venda venda : vendas) {
                if (venda.getProduto().equalsIgnoreCase(entrada.getProduto())) {
                    long dias = ChronoUnit.DAYS.between(entrada.getDataEntrada(), venda.getDataVenda());
                    totalDias += dias;
                    contador++;
                }
            }
        }

        return contador > 0 ? totalDias / contador : 0;
    }

    public double calcularPMRV() {
        List<Venda> vendas = vendaRepository.findAll();
        if (vendas.isEmpty()) return 0;

        double totalPrazo = 0;
        for (Venda v : vendas) {
            totalPrazo += v.getPrazoPagto();
        }

        return totalPrazo / vendas.size();
    }

    public double calcularPMPF() {
        List<Entrada> entradas = entradaRepository.findAll();
        if (entradas.isEmpty()) return 0;

        double totalPrazo = 0;
        for (Entrada e : entradas) {
            totalPrazo += e.getPrazoPagto();
        }

        return totalPrazo / entradas.size();
    }

    public double calcularCicloOperacional() {
        return calcularPMRE() + calcularPMRV();
    }

    public double calcularCicloCaixa() {
        return calcularCicloOperacional() - calcularPMPF();
    }

    public double calcularGiroCaixa() {
        return calcularCicloCaixa() / 360.0;
    }

    // ---------------------------
    // --- MÉTODOS ATUALIZADOS ---
    // ---------------------------

    /**
     * Calcula o Saldo Mínimo de Caixa (seguindo lógica do teste2.py).
     * CC = PMRE + PMRV - PMPF
     * GC = 360 / CC
     * MinCx = gastosAnuais / GC
     *
     * Permite valores negativos (indicando folga de caixa).
     */
    public CaixaResult calcularSaldoMinimoCaixa(double gastosAnuais, double pmre, double pmrv, double pmpf) {
        CaixaResult result = new CaixaResult();

        double cicloCaixa = pmre + pmrv - pmpf;
        result.setCicloCaixa(cicloCaixa);

        if (cicloCaixa == 0) {
            result.setGiroCaixa(0.0);
            result.setSaldoMinimo(0.0);
            return result;
        }

        double giroCaixa = 360.0 / cicloCaixa;
        result.setGiroCaixa(giroCaixa);

        double saldoMinimo = gastosAnuais / giroCaixa;
        result.setSaldoMinimo(saldoMinimo);

        return result;
    }

    /**
     * Calcula o Lote Econômico (LE).
     * LE = sqrt((2 * custoPedido * demanda) / custoManutencao)
     */
    public double calcularLoteEconomico(double demanda, double custoPedido, double custoManutencao) {
        if (demanda <= 0 || custoPedido <= 0 || custoManutencao <= 0) return 0.0;
        return Math.sqrt((2.0 * custoPedido * demanda) / custoManutencao);
    }

    /**
     * Calcula o Custo Total de Estoque (CE).
     * CE = (CM × LE)/2 + (CP × D)/LE
     */
    public double calcularCustoEstoque(double demanda, double custoPedido, double custoManutencao, double le) {
        if (demanda <= 0 || custoPedido <= 0 || custoManutencao <= 0) return 0.0;

        double lote = le > 0 ? le : calcularLoteEconomico(demanda, custoPedido, custoManutencao);
        if (lote <= 0) return 0.0;

        double custoManutencaoTotal = (custoManutencao * lote) / 2.0;
        double custoPedidoTotal = (custoPedido * demanda) / lote;

        return custoManutencaoTotal + custoPedidoTotal;
    }

    /**
     * Calcula indicadores de produtividade.
     */
    public ProdutividadeResult calcularProdutividade(double quantidadeProduzida,
                                                     double horasTrabalho,
                                                     double custoHoraTrabalho,
                                                     double horasMaquinas,
                                                     double custoHoraMaquina,
                                                     double quantidadeMateriaPrima,
                                                     double custoMateriaPrima) {
        ProdutividadeResult r = new ProdutividadeResult();

        if (quantidadeProduzida <= 0 || quantidadeMateriaPrima <= 0) {
            return r;
        }

        double produtividadeFisica = quantidadeProduzida / quantidadeMateriaPrima;

        double custoTotalTrabalho = horasTrabalho * custoHoraTrabalho;
        double custoTotalMaquinas = horasMaquinas * custoHoraMaquina;
        double custoTotalMateriaPrima = quantidadeMateriaPrima * custoMateriaPrima;

        double custoTotalProducao = custoTotalTrabalho + custoTotalMaquinas + custoTotalMateriaPrima;

        double produtividadeValor = custoTotalProducao == 0 ? 0.0 : quantidadeProduzida / custoTotalProducao;
        double custoUnitario = quantidadeProduzida == 0 ? 0.0 : custoTotalProducao / quantidadeProduzida;

        r.setProdutividadeFisica(produtividadeFisica);
        r.setProdutividadeValor(produtividadeValor);
        r.setCustoTotalProducao(custoTotalProducao);
        r.setCustoUnitario(custoUnitario);
        r.setCustoTrabalho(custoTotalTrabalho);
        r.setCustoMaquinas(custoTotalMaquinas);
        r.setCustoMateriaPrima(custoTotalMateriaPrima);

        return r;
    }

    // ---------------------------
    // --- DTOs SIMPLES (POJOs) ---
    // ---------------------------

    public static class CaixaResult {
        private double cicloCaixa;
        private double giroCaixa;
        private double saldoMinimo;

        public double getCicloCaixa() { return cicloCaixa; }
        public void setCicloCaixa(double cicloCaixa) { this.cicloCaixa = cicloCaixa; }

        public double getGiroCaixa() { return giroCaixa; }
        public void setGiroCaixa(double giroCaixa) { this.giroCaixa = giroCaixa; }

        public double getSaldoMinimo() { return saldoMinimo; }
        public void setSaldoMinimo(double saldoMinimo) { this.saldoMinimo = saldoMinimo; }
    }

    public static class ProdutividadeResult {
        private double produtividadeFisica;
        private double produtividadeValor;
        private double custoTotalProducao;
        private double custoUnitario;
        private double custoTrabalho;
        private double custoMaquinas;
        private double custoMateriaPrima;

        public double getProdutividadeFisica() { return produtividadeFisica; }
        public void setProdutividadeFisica(double produtividadeFisica) { this.produtividadeFisica = produtividadeFisica; }

        public double getProdutividadeValor() { return produtividadeValor; }
        public void setProdutividadeValor(double produtividadeValor) { this.produtividadeValor = produtividadeValor; }

        public double getCustoTotalProducao() { return custoTotalProducao; }
        public void setCustoTotalProducao(double custoTotalProducao) { this.custoTotalProducao = custoTotalProducao; }

        public double getCustoUnitario() { return custoUnitario; }
        public void setCustoUnitario(double custoUnitario) { this.custoUnitario = custoUnitario; }

        public double getCustoTrabalho() { return custoTrabalho; }
        public void setCustoTrabalho(double custoTrabalho) { this.custoTrabalho = custoTrabalho; }

        public double getCustoMaquinas() { return custoMaquinas; }
        public void setCustoMaquinas(double custoMaquinas) { this.custoMaquinas = custoMaquinas; }

        public double getCustoMateriaPrima() { return custoMateriaPrima; }
        public void setCustoMateriaPrima(double custoMateriaPrima) { this.custoMateriaPrima = custoMateriaPrima; }
    }
}
