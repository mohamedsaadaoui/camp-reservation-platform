import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Emplacement {
  id: number;
  nom: string;
  numero?: string;
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

  private apiBaseUrl = environment.emplacementApiUrl;

  constructor(private http: HttpClient) {}

  getPositions(): Observable<Emplacement[]> {
    return this.http.get<Emplacement[]>(this.apiBaseUrl);
  }

  getEmplacement(id: number): Observable<Emplacement> {
    return this.http.get<Emplacement>(`${this.apiBaseUrl}/${id}`);
  }

  createEmplacement(data: Partial<Emplacement>): Observable<Emplacement> {
    return this.http.post<Emplacement>(this.apiBaseUrl, data);
  }

  updateEmplacement(id: number, data: Partial<Emplacement>): Observable<Emplacement> {
    return this.http.put<Emplacement>(`${this.apiBaseUrl}/${id}`, data);
  }

  deleteEmplacement(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiBaseUrl}/${id}/upload-image`, formData, { responseType: 'text' });
  }

  createReservation(reservation: Reservation): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/reserver`, reservation);
  }

  getReservationsByEmplacement(emplacementId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.reservationApiUrl}/emplacement/${emplacementId}`);
  }

  getStatistiquesEmplacement(id: number): Observable<StatistiquesEmplacement> {
    return this.http.get<StatistiquesEmplacement>(`${this.apiBaseUrl}/${id}/statistiques`);
  }

  verifierDisponibilite(emplacementId: number, dateDebut: string, dateFin: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.reservationApiUrl}/emplacement/${emplacementId}/disponible?dateDebut=${dateDebut}&dateFin=${dateFin}`
    );
  }

  getAvisEmplacement(emplacementId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiBaseUrl}/${emplacementId}/avis`);
  }

  calculerPrixTotal(prixParNuit: number, dateDebut: string, dateFin: string): number {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return prixParNuit * nights;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private baseUrl = '';

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x300?text=Plage+Tunisie';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `${this.baseUrl}${imagePath}`;
  }

  getEmplacementImageUrl(emplacement: Emplacement): string {
    return this.getImageUrl(emplacement.imageUrl);
  }
}
