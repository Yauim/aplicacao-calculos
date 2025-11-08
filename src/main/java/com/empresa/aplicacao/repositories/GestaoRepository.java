package com.empresa.aplicacao.repositories;

import com.empresa.aplicacao.models.Gestao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GestaoRepository extends JpaRepository<Gestao, Long> {
}
