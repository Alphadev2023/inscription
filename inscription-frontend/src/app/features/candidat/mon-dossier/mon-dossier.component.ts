import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DossierService } from '../../../core/services/dossier.service';
import { DocumentService } from '../../../core/services/document.service';
import { DossierResponse } from '../../../core/models/dossier.model';
import {
  DocumentResponse,
  TypeDocument,
} from '../../../core/models/document.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-mon-dossier',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './mon-dossier.component.html',
})
export class MonDossierComponent implements OnInit {
  private dossierService = inject(DossierService);
  private documentService = inject(DocumentService);

  dossier = signal<DossierResponse | null>(null);
  documents = signal<DocumentResponse[]>([]);
  loading = signal(true);
  erreur = signal('');

  readonly typesDocuments: {
    type: TypeDocument;
    label: string;
    description: string;
  }[] = [
    {
      type: 'DIPLOME_BAC',
      label: 'Diplôme du Baccalauréat',
      description: 'PDF uniquement, max 5 Mo',
    },
    {
      type: 'DIPLOME_SUPERIEUR',
      label: 'Diplôme Supérieur',
      description: 'PDF uniquement, max 5 Mo',
    },
    {
      type: 'CNI_RECTO',
      label: 'CNI Recto',
      description: 'JPG, PNG, max 5 Mo',
    },
    {
      type: 'CNI_VERSO',
      label: 'CNI Verso',
      description: 'JPG, PNG, max 5 Mo',
    },
    {
      type: 'ACTE_NAISSANCE',
      label: 'Acte de naissance',
      description: 'PDF uniquement, max 5 Mo',
    },
    {
      type: 'PHOTO_IDENTITE',
      label: "Photo d'identité",
      description: 'JPG, PNG, max 2 Mo',
    },
  ];

  ngOnInit() {
    this.dossierService.monDossier().subscribe({
      next: (d) => {
        this.dossier.set(d);
        this.loading.set(false);
        this.chargerDocuments(d.id);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  chargerDocuments(dossierId: string) {
    this.documentService.listerParDossier(dossierId).subscribe({
      next: (docs) => this.documents.set(docs),
      error: () => {},
    });
  }

  getDocumentParType(type: TypeDocument): DocumentResponse | undefined {
    return this.documents().find((d) => d.type === type);
  }

  onUpload(event: Event, type: TypeDocument) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.dossier()) return;

    this.documentService.uploader(this.dossier()!.id, type, file).subscribe({
      next: () => this.chargerDocuments(this.dossier()!.id),
      error: () => this.erreur.set("Erreur lors de l'upload"),
    });
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMIS: 'Soumis',
      EN_COURS: "En cours d'examen",
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
    };
    return labels[statut] ?? statut;
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

  getDocStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      EN_ATTENTE: 'bg-neutral-100 text-neutral-600',
      VALIDE: 'bg-success-50 text-success-700',
      REJETE: 'bg-danger-50 text-danger-700',
      SUSPECT: 'bg-orange-100 text-orange-700',
    };
    return classes[statut] ?? 'bg-neutral-100 text-neutral-600';
  }

  getDocStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
      SUSPECT: 'Suspect',
    };
    return labels[statut] ?? statut;
  }

  formatTaille(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  peutModifier(): boolean {
    const statut = this.dossier()?.statut;
    return statut === 'BROUILLON' || statut === 'SOUMIS';
  }

  getDocIcon(type: TypeDocument): any {
    const doc = this.getDocumentParType(type);
    if (!doc) return 'file';
    if (doc.statut === 'VALIDE') return 'check-circle';
    if (doc.statut === 'REJETE') return 'x-circle';
    return 'clock';
  }

  getDocIconClass(type: TypeDocument): string {
    const doc = this.getDocumentParType(type);
    const base =
      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0';
    if (!doc) return `${base} bg-neutral-100 text-neutral-400`;
    if (doc.statut === 'VALIDE')
      return `${base} bg-success-50 text-success-600`;
    if (doc.statut === 'REJETE') return `${base} bg-danger-50 text-danger-600`;
    return `${base} bg-warning-50 text-warning-600`;
  }
}
