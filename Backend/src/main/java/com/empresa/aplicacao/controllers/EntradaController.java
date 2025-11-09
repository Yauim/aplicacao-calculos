package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.models.Entrada;
import com.empresa.aplicacao.repositories.EntradaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
@CrossOrigin(origins = "http://localhost:5177")
public class EntradaController {

    @Autowired
    private EntradaRepository entradaRepository;

    // Listar todas as entradas
    @GetMapping
    public List<Entrada> listar() {
        return entradaRepository.findAll();
    }

    // Criar nova entrada
    @PostMapping
    public Entrada criarEntrada(@RequestBody Entrada entradas) {
        return entradaRepository.save(entradas);
    }

    // Apagar entrada por id
    @DeleteMapping("/{id}")
    public void apagar(@PathVariable Long id) {
        entradaRepository.deleteById(id);
    }
}
