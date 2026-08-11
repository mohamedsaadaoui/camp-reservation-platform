package camping.campbackoffice.dtos;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusRequest {
    @NotBlank(message = "Le statut est requis")
    private String statut;
    private String notesAdmin;

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getNotesAdmin() { return notesAdmin; }
    public void setNotesAdmin(String notesAdmin) { this.notesAdmin = notesAdmin; }
}
