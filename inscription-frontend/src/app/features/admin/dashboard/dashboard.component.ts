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
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private dossierService = inject(DossierService);

  dossiers = signal<DossierSummaryResponse[]>([]);
  loading = signal(true);
  filtreStatut = signal<FiltreStatut>('TOUS');
  recherche = signal('');

  readonly stats: {
    label: string;
    key: FiltreStatut;
    icon: IconName;
    color: string;
  }[] = [
    {
      label: 'Total dossiers',
      key: 'TOUS',
      icon: 'file-text',
      color: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Soumis',
      key: 'SOUMIS',
      icon: 'clock',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'En cours',
      key: 'EN_COURS',
      icon: 'refresh-cw',
      color: 'bg-warning-50 text-warning-600',
    },
    {
      label: 'Validés',
      key: 'VALIDE',
      icon: 'check-circle',
      color: 'bg-success-50 text-success-600',
    },
    {
      label: 'Rejetés',
      key: 'REJETE',
      icon: 'x-circle',
      color: 'bg-danger-50 text-danger-600',
    },
  ];

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

  compter(statut: FiltreStatut): number {
    if (statut === 'TOUS') return this.dossiers().length;
    return this.dossiers().filter((d) => d.statut === statut).length;
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
      RECOURS: 'bg-purple-100 text-purple-700',
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
      RECOURS: 'Recours',
    };
    return labels[statut] ?? statut;
  }

  onRecherche(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}
