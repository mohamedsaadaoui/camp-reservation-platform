import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  AdminService,
  DashboardStats,
  RevenueStats,
  AdminReservation
} from '../admin.service';
import { PositionsService, Emplacement } from '../positions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = true;
  error = '';
  stats: DashboardStats | null = null;

  period: 'daily' | 'weekly' | 'monthly' = 'daily';
  revenueTotal = 0;

  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString('fr-FR')} TND`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value} TND` }
      }
    }
  };
  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Revenus (TND)',
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.12)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3498db'
    }]
  };

  statusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  statusChartData: ChartData<'doughnut'> = {
    labels: ['Confirmées', 'En attente', 'Annulées'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  topChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } },
      y: { grid: { display: false } }
    }
  };
  topChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Réservations',
      backgroundColor: '#2ecc71',
      borderRadius: 6
    }]
  };

  constructor(private adminService: AdminService,
              private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur statistiques dashboard:', err);
        this.error = 'Impossible de charger les statistiques. Vérifiez que les services sont démarrés.';
        this.loading = false;
      }
    });

    this.loadRevenue(this.period);
    this.loadReservations();
  }

  loadRevenue(period: 'daily' | 'weekly' | 'monthly'): void {
    this.adminService.getRevenueStats(period).subscribe({
      next: (revenue: RevenueStats) => {
        this.revenueTotal = revenue.totalRevenue || 0;
        const data = revenue.revenueData || {};
        this.revenueChartData = {
          labels: Object.keys(data),
          datasets: [{
            ...this.revenueChartData.datasets[0],
            data: Object.values(data)
          }]
        };
      },
      error: (err) => console.error('Erreur statistiques revenus:', err)
    });
  }

  setPeriod(period: 'daily' | 'weekly' | 'monthly'): void {
    this.period = period;
    this.loadRevenue(period);
  }

  private loadReservations(): void {
    this.adminService.getReservations().subscribe({
      next: (reservations) => {
        this.buildStatusChart(reservations);
        this.buildTopChart(reservations);
      },
      error: (err) => console.error('Erreur réservations:', err)
    });
  }

  private buildStatusChart(reservations: AdminReservation[]): void {
    const count = (status: string) => reservations.filter((r) => r.statut === status).length;
    this.statusChartData = {
      labels: ['Confirmées', 'En attente', 'Annulées'],
      datasets: [{
        data: [count('CONFIRMEE'), count('EN_ATTENTE'), count('ANNULEE')],
        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  private buildTopChart(reservations: AdminReservation[]): void {
    this.positionsService.getPositions().subscribe({
      next: (emplacements: Emplacement[]) => {
        const names = new Map<number, string>();
        emplacements.forEach((e) => names.set(e.id, e.nom));

        const counts = new Map<number, number>();
        reservations.forEach((r) => {
          const id = Number(r.emplacementId);
          counts.set(id, (counts.get(id) || 0) + 1);
        });

        const sorted = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        this.topChartData = {
          labels: sorted.map(([id]) => names.get(id) || `Emplacement #${id}`),
          datasets: [{
            ...this.topChartData.datasets[0],
            data: sorted.map(([, count]) => count)
          }]
        };
      },
      error: (err) => console.error('Erreur chargement emplacements:', err)
    });
  }
}
