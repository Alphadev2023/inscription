import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  readonly features = [
    {
      icon: 'file-text' as const,
      title: 'Formulaire intelligent',
      description:
        'Remplissez votre dossier en 5 étapes guidées avec sauvegarde automatique.',
    },
    {
      icon: 'upload' as const,
      title: 'Upload sécurisé',
      description:
        'Déposez vos documents en toute sécurité. PDF, JPG, PNG acceptés.',
    },
    {
      icon: 'bell' as const,
      title: 'Suivi en temps réel',
      description:
        "Suivez l'avancement de votre dossier et recevez des notifications.",
    },
    {
      icon: 'shield' as const,
      title: 'Données protégées',
      description: 'Vos données personnelles sont chiffrées et sécurisées.',
    },
    {
      icon: 'check-circle' as const,
      title: 'Validation rapide',
      description: 'Notre équipe examine votre dossier sous 24 à 48 heures.',
    },
    {
      icon: 'users' as const,
      title: 'Support dédié',
      description:
        'Une équipe disponible pour vous accompagner dans votre démarche.',
    },
  ];

  readonly etapes = [
    {
      numero: '01',
      titre: 'Créez votre compte',
      description: 'Inscrivez-vous en quelques secondes avec votre email.',
    },
    {
      numero: '02',
      titre: 'Remplissez le formulaire',
      description: 'Complétez vos informations personnelles et académiques.',
    },
    {
      numero: '03',
      titre: 'Uploadez vos documents',
      description: 'Joignez vos pièces justificatives de manière sécurisée.',
    },
    {
      numero: '04',
      titre: 'Soumettez votre dossier',
      description: 'Envoyez votre dossier complet en un clic.',
    },
    {
      numero: '05',
      titre: 'Recevez votre réponse',
      description: "Suivez l'avancement et recevez la décision par email.",
    },
  ];
}
