import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DashboardStats {
  totalEmplacements: number;
  totalReservations: number;
  revenueTotal: number;
  reservationsEnAttente: number;
  tauxOccupation: number;
  emplacementsDisponibles: number;
}

export interface RevenueStats {
  period: string;
  totalRevenue: number;
  revenueData: Record<string, number>;
}

export interface AdminReservation {
  id: string;
  emplacementId: number;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  nombrePersonnes: number;
  statut: string;
  dateCreation: string;
  commentaires: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminApiUrl = environment.adminApiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.adminApiUrl}/dashboard/stats`);
  }

  getRevenueStats(period: 'daily' | 'weekly' | 'monthly'): Observable<RevenueStats> {
    return this.http.get<RevenueStats>(`${this.adminApiUrl}/statistics/revenue`, {
      params: { period }
    });
  }

  getReservations(): Observable<AdminReservation[]> {
    return this.http.get<AdminReservation[]>(`${this.adminApiUrl}/reservations`);
  }
}
