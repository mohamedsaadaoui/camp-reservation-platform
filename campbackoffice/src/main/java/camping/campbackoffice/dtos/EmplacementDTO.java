package camping.campbackoffice.dtos;

import java.util.List;

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getEquipements() { return equipements; }
    public void setEquipements(List<String> equipements) { this.equipements = equipements; }
    public Integer getCapacite() { return capacite; }
    public void setCapacite(Integer capacite) { this.capacite = capacite; }
    public Double getSuperficie() { return superficie; }
    public void setSuperficie(Double superficie) { this.superficie = superficie; }
}
