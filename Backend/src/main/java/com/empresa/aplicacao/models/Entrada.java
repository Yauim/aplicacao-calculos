package com.empresa.aplicacao.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Entrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dataEntrada;
    private String fornecedor;
    private String produto;
    private double precoCompra;
    private int prazoPagto;

    // Getters e setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDate dataEntrada) { this.dataEntrada = dataEntrada; }

    public String getFornecedor() { return fornecedor; }
    public void setFornecedor(String fornecedor) { this.fornecedor = fornecedor; }

    public String getProduto() { return produto; }
    public void setProduto(String produto) { this.produto = produto; }

    public double getPrecoCompra() { return precoCompra; }
    public void setPrecoCompra(double precoCompra) { this.precoCompra = precoCompra; }

    public int getPrazoPagto() { return prazoPagto; }
    public void setPrazoPagto(int prazoPagto) { this.prazoPagto = prazoPagto; }

}
