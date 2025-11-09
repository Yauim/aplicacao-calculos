package com.empresa.aplicacao.models;

import jakarta.persistence.*;

@Entity
public class Gestao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double previsaoGastos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getPrevisaoGastos() { return previsaoGastos; }
    public void setPrevisaoGastos(double previsaoGastos) { this.previsaoGastos = previsaoGastos; }
}
