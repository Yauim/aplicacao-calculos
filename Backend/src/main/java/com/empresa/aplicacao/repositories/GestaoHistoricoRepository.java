package com.empresa.aplicacao.repositories;

import com.empresa.aplicacao.models.GestaoHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GestaoHistoricoRepository extends JpaRepository<GestaoHistorico, Long> {
}
