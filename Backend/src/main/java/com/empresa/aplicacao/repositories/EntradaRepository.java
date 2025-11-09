package com.empresa.aplicacao.repositories;

import com.empresa.aplicacao.models.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    // Aqui você pode criar consultas customizadas depois, se precisar
}
