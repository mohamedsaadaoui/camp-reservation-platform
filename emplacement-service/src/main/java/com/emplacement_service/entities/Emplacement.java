package com.emplacement_service.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "emplacement")
public class Emplacement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String numero;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private double prix;

    @Column(nullable = false)
    private boolean disponible = true;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(length = 1000)
    private String description;

    // Option 1: Stocker l'image en BLOB dans la base de données
    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    private String imageType;

    // Option 2: Stocker seulement le chemin de l'image (RECOMMANDE)
    @Column(name = "image_url")
    private String imageUrl;

    // Nouveaux champs pour améliorer l'application
    @ElementCollection
    @CollectionTable(name = "emplacement_equipements", joinColumns = @JoinColumn(name = "emplacement_id"))
    @Column(name = "equipement")
    private List<String> equipements = new ArrayList<>();

    @Column(name = "capacite")
    private Integer capacite = 2;

    @Column(name = "superficie")
    private Double superficie;

    // Constructeurs
    public Emplacement() {
        // Constructeur par défaut requis par JPA
    }

    public Emplacement(String nom, String type, double prix, boolean disponible,
                       double latitude, double longitude, String description) {
        this.nom = nom;
        this.type = type;
        this.prix = prix;
        this.disponible = disponible;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getEquipements() {
        return equipements;
    }

    public void setEquipements(List<String> equipements) {
        this.equipements = equipements;
    }

    public Integer getCapacite() {
        return capacite;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public Double getSuperficie() {
        return superficie;
    }

    public void setSuperficie(Double superficie) {
        this.superficie = superficie;
    }

    // Méthodes utilitaires
    public void addEquipement(String equipement) {
        if (this.equipements == null) {
            this.equipements = new ArrayList<>();
        }
        this.equipements.add(equipement);
    }

    // Méthode pour obtenir l'URL complète de l'image
    public String getCompleteImageUrl() {
        if (this.imageUrl != null && !this.imageUrl.isEmpty()) {
            return this.imageUrl;
        } else if (this.imageData != null && this.imageData.length > 0) {
            // Si vous stockez en BLOB, vous devrez créer un endpoint pour servir l'image
            return "/api/emplacements/" + this.id + "/image";
        }
        return null;
    }

    @Override
    public String toString() {
        return "Emplacement{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", type='" + type + '\'' +
                ", prix=" + prix +
                ", disponible=" + disponible +
                '}';
    }
}