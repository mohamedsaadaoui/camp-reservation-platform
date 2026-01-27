package com.emplacement_service.repo;

import com.emplacement_service.entities.Emplacement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmplacementRepository extends JpaRepository<Emplacement, Long> {

    // Trouver tous les emplacements disponibles
    List<Emplacement> findByDisponibleTrue();

    // Trouver par type
    List<Emplacement> findByType(String type);

    // Trouver par intervalle de prix
    List<Emplacement> findByPrixBetween(double prixMin, double prixMax);

    // Trouver par nom
    Optional<Emplacement> findByNom(String nom);

    // Trouver les emplacements disponibles avec capacité minimum
    @Query("SELECT e FROM Emplacement e WHERE e.disponible = true AND e.capacite >= :capaciteMin")
    List<Emplacement> findAvailableByMinimumCapacity(int capaciteMin);
}