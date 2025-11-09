package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.models.Venda;
import com.empresa.aplicacao.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "http://localhost:5177")
public class VendaController {

    @Autowired
    private VendaRepository vendaRepository;

    @GetMapping
    public List<Venda> listar() {
        return vendaRepository.findAll();
    }

    @PostMapping
    public Venda criar(@RequestBody Venda venda) {
        return vendaRepository.save(venda);
    }

    @DeleteMapping("/{id}")
    public void apagar(@PathVariable Long id) {
        vendaRepository.deleteById(id);
    }
}
