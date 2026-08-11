import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Map, tileLayer, Marker, icon } from 'leaflet';
import { PositionsService, ImageService, Emplacement, Reservation, StatistiquesEmplacement, Avis } from '../positions.service';

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

  constructor(private positionsService: PositionsService,
              private imageService: ImageService,
              private route: ActivatedRoute) {}

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
        const requestedId = this.route.snapshot.queryParamMap.get('id');
        if (requestedId) {
          const target = emplacements.find((e) => e.id.toString() === requestedId);
          if (target) {
            this.map.flyTo([target.latitude, target.longitude], 12);
            setTimeout(() => this.afficherDetailsEmplacement(target), 600);
          }
        }
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

      const popupContent = this.buildPopupContent(emplacement);

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const popupElement = popupContent.parentElement;
        if (popupElement) {
          const detailsBtn = popupContent.querySelector('.details-btn');
          const reserveBtn = popupContent.querySelector('.reserve-btn');

          if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
              this.afficherDetailsEmplacement(emplacement);
            });
          }

          if (reserveBtn) {
            reserveBtn.addEventListener('click', () => {
              this.preparerReservation(emplacement);
            });
          }
        }
      });

      return marker;
    });

    this.markers.forEach(marker => marker.addTo(this.map));
  }

  // Construit le popup avec des nœuds DOM (textContent) pour éviter toute
  // injection XSS via les données de l'emplacement (nom, type, ...).
  private buildPopupContent(emplacement: Emplacement): HTMLDivElement {
    const container = document.createElement('div');
    container.style.minWidth = '250px';
    container.style.textAlign = 'center';

    const image = document.createElement('img');
    image.src = this.imageService.getEmplacementImageUrl(emplacement);
    image.alt = emplacement.nom;
    image.style.width = '100%';
    image.style.height = '150px';
    image.style.objectFit = 'cover';
    image.style.borderRadius = '8px';
    image.style.marginBottom = '10px';
    container.appendChild(image);

    const title = document.createElement('h4');
    title.textContent = emplacement.nom;
    title.style.margin = '10px 0';
    title.style.color = '#2c3e50';
    container.appendChild(title);

    container.appendChild(this.popupLine('Type', emplacement.type));
    container.appendChild(this.popupLine('Prix', `${emplacement.prix} TND/nuit`));
    container.appendChild(this.popupLine('Disponible', emplacement.disponible ? '✅ Oui' : '❌ Non'));

    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'details-btn';
    detailsBtn.textContent = '📊 Détails';
    this.stylePopupButton(detailsBtn, '#3498db');
    container.appendChild(detailsBtn);

    const reserveBtn = document.createElement('button');
    reserveBtn.className = 'reserve-btn';
    reserveBtn.textContent = '📅 Réserver';
    this.stylePopupButton(reserveBtn, '#27ae60');
    container.appendChild(reserveBtn);

    return container;
  }

  private popupLine(label: string, value: string): HTMLParagraphElement {
    const line = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    line.appendChild(strong);
    line.appendChild(document.createTextNode(value));
    return line;
  }

  private stylePopupButton(button: HTMLButtonElement, color: string): void {
    button.style.background = color;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '8px 16px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.margin = '5px';
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
      next: (stats: any) => {
        this.statistiques = {
          emplacement,
          nombreReservations: stats.nombreReservationsTotal ?? 0,
          chiffreAffaire: stats.chiffreAffaireTotal ?? 0,
          tauxOccupation: stats.tauxOccupation ?? 0,
          moyenneDuree: 0,
          avisMoyen: 0,
          nombreAvis: 0
        };
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
        alert('❌ Impossible de vérifier la disponibilité. Réessayez plus tard.');
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