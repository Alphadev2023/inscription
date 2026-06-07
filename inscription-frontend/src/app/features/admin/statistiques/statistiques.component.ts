import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DossierService } from '../../../core/services/dossier.service';
import { DossierSummaryResponse } from '../../../core/models/dossier.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './statistiques.component.html',
})
export class StatistiquesComponent implements OnInit {
  private dossierService = inject(DossierService);

  dossiers = signal<DossierSummaryResponse[]>([]);
  loading = signal(true);

  ngOnInit() {
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

  compter(statut: string): number {
    if (statut === 'TOUS') return this.dossiers().length;
    return this.dossiers().filter((d) => d.statut === statut).length;
  }

  getPourcentage(statut: string): number {
    if (this.dossiers().length === 0) return 0;
    return Math.round((this.compter(statut) / this.dossiers().length) * 100);
  }

  getTauxValidation(): number {
    return this.getPourcentage('VALIDE');
  }

  getTauxRejet(): number {
    return this.getPourcentage('REJETE');
  }

  getScoreMoyen(): number {
    if (this.dossiers().length === 0) return 0;
    const total = this.dossiers().reduce(
      (sum, d) => sum + d.scoreCompletude,
      0,
    );
    return Math.round(total / this.dossiers().length);
  }

  getDossiersParMois(): { mois: string; count: number }[] {
    const map = new Map<string, number>();
    this.dossiers().forEach((d) => {
      const date = new Date(d.creeLe);
      const mois = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(mois, (map.get(mois) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([mois, count]) => ({ mois, count }));
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.getDossiersParMois().map((d) => d.count), 1);
    return Math.round((count / max) * 100);
  }

  readonly statsCards = [
    {
      label: 'Total dossiers',
      key: 'TOUS',
      icon: 'file-text' as const,
      color: 'bg-primary-50 text-primary-600',
      textColor: 'text-primary-600',
    },
    {
      label: 'Soumis',
      key: 'SOUMIS',
      icon: 'clock' as const,
      color: 'bg-blue-50 text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      label: 'En cours',
      key: 'EN_COURS',
      icon: 'refresh-cw' as const,
      color: 'bg-warning-50 text-warning-600',
      textColor: 'text-warning-600',
    },
    {
      label: 'Validés',
      key: 'VALIDE',
      icon: 'check-circle' as const,
      color: 'bg-success-50 text-success-600',
      textColor: 'text-success-600',
    },
    {
      label: 'Rejetés',
      key: 'REJETE',
      icon: 'x-circle' as const,
      color: 'bg-danger-50 text-danger-600',
      textColor: 'text-danger-600',
    },
    {
      label: 'Brouillons',
      key: 'BROUILLON',
      icon: 'file' as const,
      color: 'bg-neutral-100 text-neutral-600',
      textColor: 'text-neutral-600',
    },
  ];
}
