import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Emplacement {
  id: number;
  nom: string;
  type: string;
  prix: number;
  disponible: boolean;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  equipements: string[];
  capacite: number;
  superficie: number;
}

export interface Reservation {
  emplacementId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  nombrePersonnes: number;
  commentaires?: string;
}

export interface StatistiquesEmplacement {
  emplacement: Emplacement;
  nombreReservations: number;
  chiffreAffaire: number;
  tauxOccupation: number;
  moyenneDuree: number;
  avisMoyen: number;
  nombreAvis: number;
}
export class FileUploadService {
  private apiUrl = 'http://localhost:8061/api/upload';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/image`, formData);
  }}


export class  ImageService {
  
  private baseUrl = 'http://localhost:8061';

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x300?text=Plage+Tunisie';
    }
    
    // Si c'est déjà une URL complète
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si c'est un chemin relatif, ajouter le baseUrl
    // Note: Spring Boot sert les fichiers statiques depuis le dossier images
    return `${this.baseUrl}${imagePath}`;
  }

  // Méthode pour obtenir l'URL complète d'un emplacement
  getEmplacementImageUrl(emplacement: any): string {
    return this.getImageUrl(emplacement.imageUrl);
  }
}

export interface Avis {
  id: number;
  clientNom: string;
  note: number;
  commentaire: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  
  private apiBaseUrl = 'http://localhost:8061/api';

  constructor(private http: HttpClient) {}

  // Récupérer tous les emplacements
  getPositions(): Observable<Emplacement[]> {
    return this.http.get<Emplacement[]>(`${this.apiBaseUrl}/emplacements`);
  }

  // Récupérer un emplacement spécifique
  getEmplacement(id: number): Observable<Emplacement> {
    return this.http.get<Emplacement>(`${this.apiBaseUrl}/emplacements/${id}`);
  }

  // Créer une réservation
  createReservation(reservation: Reservation): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/emplacements/reserver`, reservation);
  }

  // Récupérer les réservations d'un emplacement
  getReservationsByEmplacement(emplacementId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/reservations/emplacement/${emplacementId}`);
  }

  // Récupérer les statistiques d'un emplacement
  getStatistiquesEmplacement(id: number): Observable<StatistiquesEmplacement> {
    return this.http.get<StatistiquesEmplacement>(`${this.apiBaseUrl}/emplacements/${id}/statistiques`);
  }

  // Vérifier la disponibilité
  verifierDisponibilite(emplacementId: number, dateDebut: string, dateFin: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiBaseUrl}/emplacements/${emplacementId}/disponible?dateDebut=${dateDebut}&dateFin=${dateFin}`
    );
  }

  // Récupérer les avis d'un emplacement
  getAvisEmplacement(emplacementId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiBaseUrl}/emplacements/${emplacementId}/avis`);
  }

  // Calculer le prix avec conversion en dinar
  calculerPrixTotal(prixParNuit: number, dateDebut: string, dateFin: string): number {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return prixParNuit * nights;
  }

  
}