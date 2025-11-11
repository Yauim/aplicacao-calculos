package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.models.Entrada;
import com.empresa.aplicacao.models.Venda;
import com.empresa.aplicacao.repositories.EntradaRepository;
import com.empresa.aplicacao.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "http://localhost:5177")
public class VendaController {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private EntradaRepository entradaRepository;

    // 🔹 Listar todas as vendas
    @GetMapping
    public List<Venda> listar() {
        return vendaRepository.findAll();
    }

    // 🔹 Criar nova venda (com validação de entrada existente)
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Venda venda) {
        // Verifica se o produto existe na tabela de entradas
        List<Entrada> entradas = entradaRepository.findAll();
        boolean produtoExiste = entradas.stream()
                .anyMatch(e -> e.getProduto().equalsIgnoreCase(venda.getProduto()));

        if (!produtoExiste) {
            return ResponseEntity
                    .badRequest()
                    .body("❌ Não é possível vender este produto, pois ele não foi cadastrado em Entradas.");
        }

        Venda novaVenda = vendaRepository.save(venda);
        return ResponseEntity.ok(novaVenda);
    }

    // 🔹 Deletar venda
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        vendaRepository.deleteById(id);
    }
}
