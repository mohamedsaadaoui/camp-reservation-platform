import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Reservation {
  emplacementId: string;
  clientNom: string;
  clientEmail: string;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = environment.reservationApiUrl;

  constructor(private http: HttpClient) { }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }
}
