import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { DossierService } from '../../../core/services/dossier.service';
import { DossierResponse } from '../../../core/models/dossier.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  dossierService = inject(DossierService);

  dossier = signal<DossierResponse | null>(null);
  loading = signal(true);
  erreur = signal('');

  readonly etapes = [
    {
      label: 'Informations personnelles',
      description: 'Nom, prénom, date de naissance',
    },
    {
      label: 'Documents officiels',
      description: 'Diplômes, CNI, acte de naissance',
    },
    {
      label: 'Parcours académique',
      description: 'Établissement, spécialisation',
    },
    { label: 'Coordonnées', description: 'Email, téléphone, adresse' },
    { label: 'Récapitulatif', description: 'Vérification et soumission' },
  ];

  ngOnInit() {
    this.dossierService.monDossier().subscribe({
      next: (d) => {
        this.dossier.set(d);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 || err.status === 404) {
          this.dossier.set(null);
        }
      },
    });
  }

  getStatutLabel(): string {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMIS: 'Soumis',
      EN_COURS: "En cours d'examen",
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
      RECOURS: 'Recours en cours',
    };
    return labels[this.dossier()?.statut ?? ''] ?? '—';
  }

  getStatutColor(): string {
    const colors: Record<string, string> = {
      BROUILLON: 'bg-neutral-100 text-neutral-600',
      SOUMIS: 'bg-blue-100 text-blue-700',
      EN_COURS: 'bg-warning-50 text-warning-700',
      VALIDE: 'bg-success-50 text-success-700',
      REJETE: 'bg-danger-50 text-danger-700',
      RECOURS: 'bg-purple-100 text-purple-700',
    };
    return (
      colors[this.dossier()?.statut ?? ''] ?? 'bg-neutral-100 text-neutral-600'
    );
  }

  getProgressWidth(): string {
    return `${this.dossier()?.scoreCompletude ?? 0}%`;
  }

  getProgressColor(): string {
    const score = this.dossier()?.scoreCompletude ?? 0;
    if (score >= 80) return 'bg-success-500';
    if (score >= 50) return 'bg-warning-500';
    return 'bg-primary-500';
  }

  getPrenomUser(): string {
    const email = this.auth.user()?.email ?? '';
    const nom = email.split('@')[0] ?? '';
    return nom.charAt(0).toUpperCase() + nom.slice(1);
  }
}
