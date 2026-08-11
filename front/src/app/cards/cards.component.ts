import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionsService, ImageService, Emplacement } from '../positions.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  emplacements: Emplacement[] = [];
  loading = true;

  constructor(private positionsService: PositionsService,
              private imageService: ImageService,
              private router: Router) {}

  ngOnInit() {
    this.positionsService.getPositions().subscribe({
      next: (emplacements) => {
        this.emplacements = emplacements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement des emplacements:', error);
        this.loading = false;
      }
    });
  }

  getImageUrl(emplacement: Emplacement): string {
    return this.imageService.getEmplacementImageUrl(emplacement);
  }

  explorer(emplacement: Emplacement): void {
    this.router.navigate(['/map'], { queryParams: { id: emplacement.id } });
  }
}
