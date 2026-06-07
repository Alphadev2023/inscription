import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DossierService } from '../../../../core/services/dossier.service';
import { DocumentService } from '../../../../core/services/document.service';
import { DossierResponse } from '../../../../core/models/dossier.model';
import { DocumentResponse } from '../../../../core/models/document.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dossier-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './dossier-detail.component.html',
})
export class DossierDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dossierService = inject(DossierService);
  private documentService = inject(DocumentService);

  dossier = signal<DossierResponse | null>(null);
  documents = signal<DocumentResponse[]>([]);
  loading = signal(true);
  actionLoading = signal(false);
  erreur = signal('');
  showRejetModal = signal(false);

  raisonRejet = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
  ]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.chargerDossier(id);
  }

  chargerDossier(id: string) {
    this.loading.set(true);
    this.dossierService.trouverParId(id).subscribe({
      next: (d) => {
        this.dossier.set(d);
        this.loading.set(false);
        this.chargerDocuments(d.id);
      },
      error: () => {
        this.loading.set(false);
        this.erreur.set('Dossier introuvable');
      },
    });
  }

  chargerDocuments(dossierId: string) {
    this.documentService.listerParDossier(dossierId).subscribe({
      next: (docs) => this.documents.set(docs),
      error: () => {},
    });
  }

  valider() {
    if (!this.dossier()) return;
    this.actionLoading.set(true);
    this.dossierService.valider(this.dossier()!.id).subscribe({
      next: (d) => {
        this.dossier.set(d);
        this.actionLoading.set(false);
      },
      error: () => {
        this.actionLoading.set(false);
        this.erreur.set('Erreur lors de la validation');
      },
    });
  }

  ouvrirModalRejet() {
    this.showRejetModal.set(true);
  }

  fermerModalRejet() {
    this.showRejetModal.set(false);
    this.raisonRejet.reset();
  }

  confirmerRejet() {
    if (this.raisonRejet.invalid || !this.dossier()) return;
    this.actionLoading.set(true);
    this.dossierService
      .rejeter(this.dossier()!.id, this.raisonRejet.value!)
      .subscribe({
        next: (d) => {
          this.dossier.set(d);
          this.actionLoading.set(false);
          this.fermerModalRejet();
        },
        error: () => {
          this.actionLoading.set(false);
          this.erreur.set('Erreur lors du rejet');
        },
      });
  }

  retourListe() {
    this.router.navigate(['/admin/dashboard']);
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      BROUILLON: 'bg-neutral-100 text-neutral-600',
      SOUMIS: 'bg-blue-100 text-blue-700',
      EN_COURS: 'bg-warning-50 text-warning-700',
      VALIDE: 'bg-success-50 text-success-700',
      REJETE: 'bg-danger-50 text-danger-700',
    };
    return classes[statut] ?? 'bg-neutral-100 text-neutral-600';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMIS: 'Soumis',
      EN_COURS: 'En cours',
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
    };
    return labels[statut] ?? statut;
  }

  getDocStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      EN_ATTENTE: 'bg-neutral-100 text-neutral-600',
      VALIDE: 'bg-success-50 text-success-700',
      REJETE: 'bg-danger-50 text-danger-700',
      SUSPECT: 'bg-orange-100 text-orange-700',
    };
    return classes[statut] ?? 'bg-neutral-100 text-neutral-600';
  }

  getDocTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      DIPLOME_BAC: 'Diplôme Baccalauréat',
      DIPLOME_SUPERIEUR: 'Diplôme Supérieur',
      CNI_RECTO: 'CNI Recto',
      CNI_VERSO: 'CNI Verso',
      ACTE_NAISSANCE: 'Acte de naissance',
      PHOTO_IDENTITE: "Photo d'identité",
    };
    return labels[type] ?? type;
  }

  peutValider(): boolean {
    const statut = this.dossier()?.statut;
    return statut === 'SOUMIS' || statut === 'EN_COURS';
  }

  peutRejeter(): boolean {
    const statut = this.dossier()?.statut;
    return statut === 'SOUMIS' || statut === 'EN_COURS';
  }

  validerDocument(documentId: string, approuve: boolean) {
    this.documentService.valider(documentId, approuve).subscribe({
      next: () => this.chargerDocuments(this.dossier()!.id),
      error: () => this.erreur.set('Erreur lors de la validation du document'),
    });
  }

  voirDocument(documentId: string) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8081/api/documents/${documentId}/telecharger`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      })
      .catch(() => this.erreur.set("Erreur lors de l'ouverture du document"));
  }
}
