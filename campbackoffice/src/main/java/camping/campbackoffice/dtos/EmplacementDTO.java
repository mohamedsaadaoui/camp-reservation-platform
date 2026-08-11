package camping.campbackoffice.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class EmplacementDTO {
    private Long id;
    @NotBlank
    @Size(max = 100)
    private String nom;
    @Size(max = 50)
    private String numero;
    @Size(max = 100)
    private String ville;
    @NotBlank
    @Size(max = 50)
    private String type;
    @NotNull
    @DecimalMin(value = "0.0")
    private Double prix;
    private Boolean disponible;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    @Size(max = 1000)
    private String description;
    @Size(max = 500)
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
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
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
