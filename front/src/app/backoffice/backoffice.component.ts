import { Component, OnInit } from '@angular/core';
import { PositionsService, ImageService, Emplacement } from '../positions.service';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit {

  types: string[] = ['TENTE', 'CARAVANE', 'MOBILHOME', 'BUNGALOW', 'CAMPING-CAR'];

  form = {
    nom: '',
    numero: '',
    ville: '',
    type: 'TENTE',
    prix: 15,
    disponible: true,
    latitude: 34.8151,
    longitude: 10.6417,
    capacite: 2,
    superficie: 20,
    description: '',
    equipements: ''
  };

  selectedFile: File | null = null;
  emplacements: Emplacement[] = [];
  loading = false;
  message = '';
  messageError = false;
  editingId: number | null = null;

  constructor(private positionsService: PositionsService,
              private imageService: ImageService) {}

  ngOnInit() {
    this.loadEmplacements();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
  }

  loadEmplacements(): void {
    this.positionsService.getPositions().subscribe({
      next: (emplacements) => {
        this.emplacements = emplacements;
      },
      error: (error) => {
        console.error('Erreur chargement emplacements:', error);
      }
    });
  }

  onSave(): void {
    if (!this.form.nom || !this.form.type || !this.form.prix) {
      this.showMessage('Veuillez remplir au minimum le nom, le type et le prix', true);
      return;
    }

    const equipements = this.form.equipements
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    const payload: Partial<Emplacement> = {
      nom: this.form.nom,
      numero: this.form.numero || undefined,
      ville: this.form.ville || undefined,
      type: this.form.type,
      prix: Number(this.form.prix),
      disponible: this.form.disponible,
      latitude: Number(this.form.latitude),
      longitude: Number(this.form.longitude),
      capacite: Number(this.form.capacite),
      superficie: Number(this.form.superficie),
      description: this.form.description,
      equipements
    };

    this.loading = true;
    const request = this.editingId
      ? this.positionsService.updateEmplacement(this.editingId, payload)
      : this.positionsService.createEmplacement(payload);

    request.subscribe({
      next: (saved) => {
        const afterSave = (newImageUrl?: string) => {
          this.loading = false;
          this.showMessage(
            newImageUrl
              ? `Emplacement « ${saved.nom} » enregistré avec sa nouvelle image`
              : `Emplacement « ${saved.nom} » enregistré`
          );
          this.resetForm();
          this.loadEmplacements();
        };

        if (this.selectedFile) {
          this.positionsService.uploadImage(saved.id, this.selectedFile).subscribe({
            next: () => afterSave(),
            error: (error) => {
              console.error('Erreur upload image:', error);
              this.loading = false;
              this.showMessage('Emplacement enregistré mais erreur lors de l\'upload de l\'image', true);
              this.resetForm();
              this.loadEmplacements();
            }
          });
        } else {
          afterSave();
        }
      },
      error: (error) => {
        console.error('Erreur enregistrement emplacement:', error);
        this.loading = false;
        this.showMessage(this.editingId ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création', true);
      }
    });
  }

  onEdit(emplacement: Emplacement): void {
    this.editingId = emplacement.id;
    this.form = {
      nom: emplacement.nom,
      numero: emplacement.numero || '',
      ville: emplacement.ville || '',
      type: emplacement.type,
      prix: emplacement.prix,
      disponible: emplacement.disponible,
      latitude: emplacement.latitude,
      longitude: emplacement.longitude,
      capacite: emplacement.capacite,
      superficie: emplacement.superficie,
      description: emplacement.description,
      equipements: (emplacement.equipements || []).join(', ')
    };
    this.selectedFile = null;
    this.message = '';
    document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  onCancelEdit(): void {
    this.editingId = null;
    this.selectedFile = null;
    this.resetForm();
  }

  onDelete(emplacement: Emplacement): void {
    if (!confirm(`Supprimer l'emplacement « ${emplacement.nom} » ?`)) {
      return;
    }
    this.positionsService.deleteEmplacement(emplacement.id).subscribe({
      next: () => {
        this.showMessage('Emplacement supprimé');
        this.loadEmplacements();
      },
      error: (error) => {
        console.error('Erreur suppression emplacement:', error);
        this.showMessage('Erreur lors de la suppression', true);
      }
    });
  }

  getImageUrl(emplacement: Emplacement): string {
    return this.imageService.getEmplacementImageUrl(emplacement);
  }

  private resetForm(): void {
    this.form = {
      nom: '',
      numero: '',
      ville: '',
      type: 'TENTE',
      prix: 15,
      disponible: true,
      latitude: 34.8151,
      longitude: 10.6417,
      capacite: 2,
      superficie: 20,
      description: '',
      equipements: ''
    };
    this.selectedFile = null;
    this.editingId = null;
  }

  private showMessage(message: string, isError = false): void {
    this.message = message;
    this.messageError = isError;
    setTimeout(() => {
      this.message = '';
    }, 6000);
  }
}
