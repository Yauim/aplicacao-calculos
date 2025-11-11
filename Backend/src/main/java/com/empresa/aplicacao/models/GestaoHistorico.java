package com.empresa.aplicacao.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class GestaoHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataCalculo;
    private double cicloCaixa;
    private double saldoMinimo;

    public GestaoHistorico() {}

    public GestaoHistorico(LocalDate dataCalculo, double cicloCaixa, double saldoMinimo) {
        this.dataCalculo = dataCalculo;
        this.cicloCaixa = cicloCaixa;
        this.saldoMinimo = saldoMinimo;
    }

    public Long getId() { return id; }
    public LocalDate getDataCalculo() { return dataCalculo; }
    public void setDataCalculo(LocalDate dataCalculo) { this.dataCalculo = dataCalculo; }
    public double getCicloCaixa() { return cicloCaixa; }
    public void setCicloCaixa(double cicloCaixa) { this.cicloCaixa = cicloCaixa; }
    public double getSaldoMinimo() { return saldoMinimo; }
    public void setSaldoMinimo(double saldoMinimo) { this.saldoMinimo = saldoMinimo; }
}
