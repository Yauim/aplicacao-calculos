package com.empresa.aplicacao.services;

import com.empresa.aplicacao.models.Entrada;
import com.empresa.aplicacao.models.Venda;
import com.empresa.aplicacao.repositories.EntradaRepository;
import com.empresa.aplicacao.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CalculoService {

    @Autowired
    private EntradaRepository entradaRepository;

    @Autowired
    private VendaRepository vendaRepository;

    // PMRE = Prazo Médio de Renovação de Estoques
    public double calcularPMRE() {
        List<Entrada> entradas = entradaRepository.findAll();
        List<Venda> vendas = vendaRepository.findAll();

        double totalDias = 0;
        int count = 0;

        for (Entrada e : entradas) {
            for (Venda v : vendas) {
                if (v.getProduto().equals(e.getProduto())) {
                    long dias = ChronoUnit.DAYS.between(e.getDataEntrada(), v.getDataVenda());
                    totalDias += dias;
                    count++;
                }
            }
        }

        return count > 0 ? totalDias / count : 0;
    }

    // PMRV = Prazo Médio de Recebimento de Vendas
    public double calcularPMRV() {
        List<Venda> vendas = vendaRepository.findAll();
        double totalDias = 0;

        for (Venda v : vendas) {
            int prazo = v.getPrazoPagto(); // Pix=0, Debito=0, Credito=30
            totalDias += prazo;
        }

        return vendas.size() > 0 ? totalDias / vendas.size() : 0;
    }

    // PMPF = Prazo Médio de Pagamento a Fornecedor
    public double calcularPMPF() {
        List<Entrada> entradas = entradaRepository.findAll();
        double total = 0;

        for (Entrada e : entradas) {
            total += e.getPrazoPagto();
        }

        return entradas.size() > 0 ? total / entradas.size() : 0;
    }

    // Ciclo Operacional = PMRE + PMRV
    public double calcularCicloOperacional() {
        return calcularPMRE() + calcularPMRV();
    }

    // Ciclo de Caixa = Ciclo Operacional - PMPF
    public double calcularCicloCaixa() {
        return calcularCicloOperacional() - calcularPMPF();
    }

    // Giro do Caixa = Ciclo de Caixa / 360
    public double calcularGiroCaixa() {
        return calcularCicloCaixa() / 360;
    }

    // Saldo Mínimo de Caixa = Previsao de Gastos / Giro do Caixa
    public double calcularSaldoMinimo(double previsaoGastos) {
        double giro = calcularGiroCaixa();
        return giro != 0 ? previsaoGastos / giro : 0;
    }
}
