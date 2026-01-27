package camping.campbackoffice.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// EmplacementDTO.java
public class EmplacementDTO {
    private Long id;
    private String nom;
    private String numero;
    private String type;
    private Double prix;
    private Boolean disponible;
    private Double latitude;
    private Double longitude;
    private String description;
    private String imageUrl;
    private List<String> equipements;
    private Integer capacite;
    private Double superficie;

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getEquipements() { return equipements; }
    public void setEquipements(List<String> equipements) { this.equipements = equipements; }
    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }
}

