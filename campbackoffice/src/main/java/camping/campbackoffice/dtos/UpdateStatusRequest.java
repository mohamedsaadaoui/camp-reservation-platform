package camping.campbackoffice.dtos;

public class UpdateStatusRequest {
    private String statut;
    private String notesAdmin;

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getNotesAdmin() { return notesAdmin; }
    public void setNotesAdmin(String notesAdmin) { this.notesAdmin = notesAdmin; }
}
