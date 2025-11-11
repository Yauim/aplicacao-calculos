package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.models.Gestao;
import com.empresa.aplicacao.models.GestaoHistorico;
import com.empresa.aplicacao.repositories.GestaoRepository;
import com.empresa.aplicacao.repositories.GestaoHistoricoRepository;
import com.empresa.aplicacao.services.CalculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/gestao")
@CrossOrigin(origins = "http://localhost:5177")
public class GestaoController {

    @Autowired
    private GestaoRepository gestaoRepository;

    @Autowired
    private GestaoHistoricoRepository gestaoHistoricoRepository;

    @Autowired
    private CalculoService calculoService;

    // 🔹 Listar todas as gestões
    @GetMapping
    public List<Gestao> listar() {
        return gestaoRepository.findAll();
    }

    // 🔹 Criar nova gestão (agora com histórico)
    @PostMapping
    public Gestao criar(@RequestBody Gestao gestao) {
        // Salva a previsão no banco
        Gestao novaGestao = gestaoRepository.save(gestao);

        double previsaoGastos = gestao.getPrevisaoGastos();

        // Calcula os indicadores
        double pmre = calculoService.calcularPMRE();
        double pmrv = calculoService.calcularPMRV();
        double pmpf = calculoService.calcularPMPF();

        // Calcula ciclo e saldo mínimo (versão atualizada)
        CalculoService.CaixaResult caixa = calculoService.calcularSaldoMinimoCaixa(previsaoGastos, pmre, pmrv, pmpf);

        // Cria e salva no histórico
        GestaoHistorico hist = new GestaoHistorico(LocalDate.now(), caixa.getCicloCaixa(), caixa.getSaldoMinimo());
        gestaoHistoricoRepository.save(hist);

        return novaGestao;
    }

    // 🔹 Apagar gestão pelo ID
    @DeleteMapping("/{id}")
    public void apagar(@PathVariable Long id) {
        gestaoRepository.deleteById(id);
    }

    // 🔹 Endpoint de cálculo (sem salvar histórico)
    @GetMapping("/calculos")
    public Map<String, Double> calcular() {
        double previsaoGastos = gestaoRepository.findAll().stream()
                .findFirst()
                .map(Gestao::getPrevisaoGastos)
                .orElse(0.0);

        double pmre = calculoService.calcularPMRE();
        double pmrv = calculoService.calcularPMRV();
        double pmpf = calculoService.calcularPMPF();
        double cicloOperacional = pmre + pmrv;
        double cicloCaixa = cicloOperacional - pmpf;

        CalculoService.CaixaResult caixa = calculoService.calcularSaldoMinimoCaixa(previsaoGastos, pmre, pmrv, pmpf);

        Map<String, Double> resultado = new HashMap<>();
        resultado.put("pmre", pmre);
        resultado.put("pmrv", pmrv);
        resultado.put("pmpf", pmpf);
        resultado.put("cicloOperacional", cicloOperacional);
        resultado.put("cicloCaixa", cicloCaixa);
        resultado.put("saldoMinimo", caixa.getSaldoMinimo());

        return resultado;
    }

    // 🔹 Listar histórico
    @GetMapping("/historico")
    public List<GestaoHistorico> listarHistorico() {
        return gestaoHistoricoRepository.findAll();
    }

    // 🔹 Apagar item do histórico
    @DeleteMapping("/historico/{id}")
    public void apagarHistorico(@PathVariable Long id) {
        gestaoHistoricoRepository.deleteById(id);
    }
}
