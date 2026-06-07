import { Pipe, PipeTransform } from '@angular/core';
import { StatutDossier } from '../../core/models/dossier.model';
import { StatutValidation } from '../../core/models/document.model';

@Pipe({ name: 'statut', standalone: true })
export class StatutPipe implements PipeTransform {
  transform(value: StatutDossier | StatutValidation): string {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      SOUMIS: 'Soumis',
      EN_COURS: 'En cours',
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
      RECOURS: 'Recours',
      EN_ATTENTE: 'En attente',
      SUSPECT: 'Suspect',
    };
    return labels[value] ?? value;
  }
}
