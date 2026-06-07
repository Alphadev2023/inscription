import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DossierService } from '../../../core/services/dossier.service';
import {
  DossierSummaryResponse,
  StatutDossier,
} from '../../../core/models/dossier.model';
import {
  IconComponent,
  IconName,
} from '../../../shared/components/icon/icon.component';

type FiltreStatut = StatutDossier | 'TOUS';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dossiers.component.html',
})
export class DossiersComponent implements OnInit {
  private dossierService = inject(DossierService);

  dossiers = signal<DossierSummaryResponse[]>([]);
  loading = signal(true);
  filtreStatut = signal<FiltreStatut>('TOUS');
  recherche = signal('');

  readonly filtres: { label: string; value: FiltreStatut }[] = [
    { label: 'Tous', value: 'TOUS' },
    { label: 'Soumis', value: 'SOUMIS' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Validés', value: 'VALIDE' },
    { label: 'Rejetés', value: 'REJETE' },
    { label: 'Brouillon', value: 'BROUILLON' },
  ];

  ngOnInit() {
    this.chargerDossiers();
  }

  chargerDossiers() {
    this.loading.set(true);
    this.dossierService.lister().subscribe({
      next: (d) => {
        this.dossiers.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  setFiltre(filtre: FiltreStatut) {
    this.filtreStatut.set(filtre);
  }

  dossiersFiltres(): DossierSummaryResponse[] {
    return this.dossiers().filter((d) => {
      const matchStatut =
        this.filtreStatut() === 'TOUS' || d.statut === this.filtreStatut();
      const matchRecherche =
        this.recherche() === '' ||
        d.nomCandidat.toLowerCase().includes(this.recherche().toLowerCase()) ||
        d.prenomCandidat.toLowerCase().includes(this.recherche().toLowerCase());
      return matchStatut && matchRecherche;
    });
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

  onRecherche(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}
