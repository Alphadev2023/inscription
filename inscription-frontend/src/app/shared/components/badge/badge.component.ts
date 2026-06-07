import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatutDossier } from '../../../core/models/dossier.model';
import { StatutValidation } from '../../../core/models/document.model';
import { StatutPipe } from '../../pipes/statut.pipe';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, StatutPipe],
  template: `
    <span [class]="badgeClass()">
      {{ statut() | statut }}
    </span>
  `,
})
export class BadgeComponent {
  statut = input.required<StatutDossier | StatutValidation>();

  badgeClass(): string {
    const base =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const styles: Record<string, string> = {
      BROUILLON: `${base} bg-neutral-100 text-neutral-600`,
      SOUMIS: `${base} bg-blue-100 text-blue-800`,
      EN_COURS: `${base} bg-warning-50 text-warning-700`,
      VALIDE: `${base} bg-success-50 text-success-700`,
      REJETE: `${base} bg-danger-50 text-danger-700`,
      RECOURS: `${base} bg-purple-100 text-purple-800`,
      EN_ATTENTE: `${base} bg-neutral-100 text-neutral-600`,
      SUSPECT: `${base} bg-orange-100 text-orange-800`,
    };
    return styles[this.statut()] ?? base;
  }
}
