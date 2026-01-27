import { Component, OnInit, Renderer2 } from '@angular/core';
import { Map, tileLayer, Marker, icon } from 'leaflet';
import { PositionsService, Emplacement, Reservation, StatistiquesEmplacement, Avis } from '../positions.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: Map;
  markers: Marker[] = [];
  selectedEmplacement: Emplacement | null = null;
  showReservationForm: boolean = false;
  showDetailsPanel: boolean = false;
  statistiques: StatistiquesEmplacement | null = null;
  avis: Avis[] = [];
  disponibiliteVerifiee: boolean = false;

  // Données de réservation
  reservation: Reservation = {
    emplacementId: '',
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    dateDebut: '',
    dateFin: '',
    prixTotal: 0,
    nombrePersonnes: 1,
    commentaires: ''
  };

  constructor(private positionsService: PositionsService, private renderer: Renderer2) {}

  ngOnInit() {
    this.initMap();
    this.loadEmplacements();
  }

  private initMap() {
    this.map = new Map('map').setView([34.8151, 10.6417], 6);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private loadEmplacements() {
    this.positionsService.getPositions().subscribe({
      next: (emplacements: Emplacement[]) => {
        this.createMarkers(emplacements);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des emplacements:', error);
        // Données de démo
        const demoEmplacements: Emplacement[] = [
          {
            id: 1,
            nom: 'Emplacement A1',
            type: 'TENTE',
            prix: 15,
            disponible: true,
            latitude: 34.8151,
            longitude: 10.6417,
            description: 'Emplacement ombragé près des sanitaires',
            imageUrl: 'https://via.placeholder.com/400x300',
            equipements: ['Eau', 'Électricité', 'Sanitaires'],
            capacite: 4,
            superficie: 50
          },
          {
            id: 2, 
            nom: 'Emplacement B2',
            type: 'CARAVANE',
            prix: 25,
            disponible: true,
            latitude: 34.8251,
            longitude: 10.6517,
            description: 'Avec branchement eau et électricité',
            imageUrl: 'https://via.placeholder.com/400x300',
            equipements: ['Eau', 'Électricité', 'WiFi', 'Barbecue'],
            capacite: 6,
            superficie: 80
          }
        ];
        this.createMarkers(demoEmplacements);
      }
    });
  }

  private createMarkers(emplacements: Emplacement[]) {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.markers = emplacements.map((emplacement) => {
      const customIcon = icon({
        iconSize: [32, 41],
        iconAnchor: [16, 41],
        iconUrl: this.getMarkerIcon(emplacement.type),
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
      });

      const marker = new Marker([emplacement.latitude, emplacement.longitude], {
        icon: customIcon
      });

      const popupContent = `
        <div style="min-width: 250px; text-align:center;">
<img [src]="'http://localhost:8061/api/emplacements/' + selectedEmplacement.id + '/image'" 
               style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
          <h4 style="margin:10px 0; color:#2c3e50;">${emplacement.nom}</h4>
          <p><strong>Type:</strong> ${emplacement.type}</p>
          <p><strong>Prix:</strong> ${emplacement.prix} TND/nuit</p>
          <p><strong>Disponible:</strong> ${emplacement.disponible ? '✅ Oui' : '❌ Non'}</p>
          <button class="details-btn" style="background:#3498db; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; margin:5px;">
            📊 Détails
          </button>
          <button class="reserve-btn" style="background:#27ae60; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; margin:5px;">
            📅 Réserver
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const popupElement = document.querySelector('.leaflet-popup-content');
        if (popupElement) {
          const detailsBtn = popupElement.querySelector('.details-btn');
          const reserveBtn = popupElement.querySelector('.reserve-btn');
          
          if (detailsBtn) {
            this.renderer.listen(detailsBtn, 'click', () => {
              this.afficherDetailsEmplacement(emplacement);
            });
          }
          
          if (reserveBtn) {
            this.renderer.listen(reserveBtn, 'click', () => {
              this.preparerReservation(emplacement);
            });
          }
        }
      });

      return marker;
    });

    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private getMarkerIcon(type: string): string {
    const icons = {
      'TENTE': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      'CARAVANE': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      'MOBILHOME': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
    };
    return icons[type as keyof typeof icons] || 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
  }

  afficherDetailsEmplacement(emplacement: Emplacement) {
    this.selectedEmplacement = emplacement;
    this.showDetailsPanel = true;
    
    // Charger les statistiques
    this.positionsService.getStatistiquesEmplacement(emplacement.id).subscribe({
      next: (stats) => {
        this.statistiques = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });

    // Charger les avis
    this.positionsService.getAvisEmplacement(emplacement.id).subscribe({
      next: (avisList) => {
        this.avis = avisList;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.avis = [];
      }
    });
  }

  preparerReservation(emplacement: Emplacement) {
    this.selectedEmplacement = emplacement;
    this.reservation.emplacementId = emplacement.id.toString();
    this.showReservationForm = true;
    this.showDetailsPanel = false;
  }

  // Réserver un emplacement
  reserverEmplacement() {
    if (!this.selectedEmplacement) return;

    // Validation
    if (!this.reservation.clientNom || !this.reservation.clientEmail || !this.reservation.clientTelephone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!this.reservation.dateDebut || !this.reservation.dateFin) {
      alert('Veuillez sélectionner les dates de réservation');
      return;
    }

    // Vérifier la disponibilité
    this.positionsService.verifierDisponibilite(
      this.selectedEmplacement.id, 
      this.reservation.dateDebut, 
      this.reservation.dateFin
    ).subscribe({
      next: (disponible) => {
        if (disponible) {
          this.confirmerReservation();
        } else {
          alert('❌ Cet emplacement n\'est pas disponible pour les dates sélectionnées');
        }
      },
      error: (error) => {
        console.error('Erreur vérification disponibilité:', error);
        this.confirmerReservation(); // Poursuivre malgré l'erreur
      }
    });
  }

  private confirmerReservation() {
    this.positionsService.createReservation(this.reservation).subscribe({
      next: (response) => {
        alert('✅ Réservation créée avec succès!');
        this.showReservationForm = false;
        this.resetReservationForm();
      },
      error: (error) => {
        console.error('Erreur réservation:', error);
        alert('❌ Erreur lors de la réservation');
      }
    });
  }

  private resetReservationForm() {
    this.reservation = {
      emplacementId: '',
      clientNom: '',
      clientEmail: '',
      clientTelephone: '',
      dateDebut: '',
      dateFin: '',
      prixTotal: 0,
      nombrePersonnes: 1,
      commentaires: ''
    };
    this.selectedEmplacement = null;
    this.disponibiliteVerifiee = false;
  }

  // Calcul automatique du prix
  onDatesChange() {
    if (this.selectedEmplacement && this.reservation.dateDebut && this.reservation.dateFin) {
      const start = new Date(this.reservation.dateDebut);
      const end = new Date(this.reservation.dateFin);
      
      if (start >= end) {
        alert('La date de fin doit être après la date de début');
        this.reservation.dateFin = '';
        return;
      }

      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      this.reservation.prixTotal = this.positionsService.calculerPrixTotal(
        this.selectedEmplacement.prix, 
        this.reservation.dateDebut, 
        this.reservation.dateFin
      );
      
      // Vérifier la disponibilité
      this.verifierDisponibilite();
    }
  }

  private verifierDisponibilite() {
    if (this.selectedEmplacement && this.reservation.dateDebut && this.reservation.dateFin) {
      this.positionsService.verifierDisponibilite(
        this.selectedEmplacement.id,
        this.reservation.dateDebut,
        this.reservation.dateFin
      ).subscribe({
        next: (disponible) => {
          this.disponibiliteVerifiee = true;
        },
        error: (error) => {
          console.error('Erreur vérification disponibilité:', error);
        }
      });
    }
  }

  fermerDetails() {
    this.showDetailsPanel = false;
    this.selectedEmplacement = null;
    this.statistiques = null;
    this.avis = [];
  }

  fermerReservation() {
    this.showReservationForm = false;
    this.resetReservationForm();
  }

  getStars(note: number): string {
    return '★'.repeat(Math.floor(note)) + '☆'.repeat(5 - Math.floor(note));
  }

  calculateNuits(): number {
  if (this.reservation.dateDebut && this.reservation.dateFin) {
    const start = new Date(this.reservation.dateDebut);
    const end = new Date(this.reservation.dateFin);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
}
}