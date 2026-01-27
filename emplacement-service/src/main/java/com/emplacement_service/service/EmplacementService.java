package com.emplacement_service.service;


import com.emplacement_service.entities.Emplacement;
import com.emplacement_service.repo.EmplacementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmplacementService {

    @Autowired
    private EmplacementRepository emplacementRepository;

    // Récupérer tous les emplacements
    public List<Emplacement> getAllEmplacements() {
        return emplacementRepository.findAll();
    }

    // Récupérer un emplacement par ID
    public Optional<Emplacement> getEmplacementById(Long id) {
        return emplacementRepository.findById(id);
    }

    // Récupérer les emplacements disponibles
    public List<Emplacement> getAvailableEmplacements() {
        return emplacementRepository.findByDisponibleTrue();
    }

    // Sauvegarder un emplacement
    public Emplacement saveEmplacement(Emplacement emplacement) {
        return emplacementRepository.save(emplacement);
    }

    // Supprimer un emplacement
    public void deleteEmplacement(Long id) {
        emplacementRepository.deleteById(id);
    }

    // Mettre à jour un emplacement
    public Emplacement updateEmplacement(Long id, Emplacement emplacementDetails) {
        Optional<Emplacement> optionalEmplacement = emplacementRepository.findById(id);
        if (optionalEmplacement.isPresent()) {
            Emplacement emplacement = optionalEmplacement.get();

            // Mettre à jour tous les champs
            emplacement.setNom(emplacementDetails.getNom());
            emplacement.setNumero(emplacementDetails.getNumero());
            emplacement.setType(emplacementDetails.getType());
            emplacement.setPrix(emplacementDetails.getPrix());
            emplacement.setDisponible(emplacementDetails.isDisponible());
            emplacement.setLatitude(emplacementDetails.getLatitude());
            emplacement.setLongitude(emplacementDetails.getLongitude());


            return emplacementRepository.save(emplacement);
        }
        return null;
    }

    // Mettre à jour seulement l'URL de l'image
    public Emplacement updateImageUrl(Long id, String imageUrl) {
        Optional<Emplacement> optionalEmplacement = emplacementRepository.findById(id);
        if (optionalEmplacement.isPresent()) {
            Emplacement emplacement = optionalEmplacement.get();
            emplacement.setImageUrl(imageUrl);
            return emplacementRepository.save(emplacement);
        }
        return null;
    }

    // Trouver par type
    public List<Emplacement> getEmplacementsByType(String type) {
        return emplacementRepository.findByType(type);
    }

    // Vérifier si un emplacement existe
    public boolean existsById(Long id) {
        return emplacementRepository.existsById(id);
    }
}