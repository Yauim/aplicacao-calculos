package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.models.Gestao;
import com.empresa.aplicacao.repositories.GestaoRepository;
import com.empresa.aplicacao.services.CalculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/gestao")
@CrossOrigin(origins = "http://localhost:5177")
public class GestaoController {

    @Autowired
    private GestaoRepository gestaoRepository;

    @Autowired
    private CalculoService calculoService;  // injetar o service de cálculos

    // Listar todas gestões
    @GetMapping
    public List<Gestao> listar() {
        return gestaoRepository.findAll();
    }

    // Criar nova gestão
    @PostMapping
    public Gestao criar(@RequestBody Gestao gestao) {
        return gestaoRepository.save(gestao);
    }

    // Apagar gestão pelo ID
    @DeleteMapping("/{id}")
    public void apagar(@PathVariable Long id) {
        gestaoRepository.deleteById(id);
    }

    // Endpoint para os cálculos
    @GetMapping("/calculos")
    public Map<String, Double> calcular() {
        // Pega a previsão de gastos da primeira gestão cadastrada (ou 0 se não existir)
        double previsaoGastos = gestaoRepository.findAll().stream()
                .findFirst()
                .map(Gestao::getPrevisaoGastos)
                .orElse(0.0);

        return Map.of(
                "pmre", calculoService.calcularPMRE(),
                "pmrv", calculoService.calcularPMRV(),
                "pmpf", calculoService.calcularPMPF(),
                "cicloOperacional", calculoService.calcularCicloOperacional(),
                "cicloCaixa", calculoService.calcularCicloCaixa(),
                "saldoMinimo", calculoService.calcularSaldoMinimo(previsaoGastos)
        );
    }
}
