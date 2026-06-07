import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DossierService } from '../../../core/services/dossier.service';
import { DocumentService } from '../../../core/services/document.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { TypeDocument } from '../../../core/models/document.model';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, StepperComponent],
  templateUrl: './inscription.component.html',
})
export class InscriptionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dossierService = inject(DossierService);
  private documentService = inject(DocumentService);
  private router = inject(Router);

  etapeActuelle = signal(0);
  loading = signal(false);
  erreur = signal('');
  dossierId = signal<string | null>(null);

  // Fichiers uploadés à l'étape 2
  fichiersUploades = signal<Record<string, boolean>>({});
  fichiersEnCours = signal<Record<string, boolean>>({});

  readonly etapes = [
    { label: 'Informations', description: 'Données personnelles' },
    { label: 'Documents', description: 'Pièces justificatives' },
    { label: 'Parcours', description: 'Académique' },
    { label: 'Coordonnées', description: 'Contact' },
    { label: 'Récapitulatif', description: 'Validation' },
  ];

  readonly documentsRequis: {
    type: TypeDocument;
    label: string;
    required: boolean;
    description: string;
  }[] = [
    {
      type: 'DIPLOME_BAC',
      label: 'Diplôme du Baccalauréat',
      required: true,
      description: 'PDF uniquement, max 5 Mo',
    },
    {
      type: 'CNI_RECTO',
      label: 'CNI Recto',
      required: true,
      description: 'JPG ou PNG uniquement, max 5 Mo',
    },
    {
      type: 'CNI_VERSO',
      label: 'CNI Verso',
      required: true,
      description: 'JPG ou PNG uniquement, max 5 Mo',
    },
    {
      type: 'ACTE_NAISSANCE',
      label: 'Acte de naissance',
      required: true,
      description: 'PDF uniquement, max 5 Mo',
    },
    {
      type: 'PHOTO_IDENTITE',
      label: "Photo d'identité",
      required: true,
      description: 'JPG ou PNG uniquement, max 2 Mo',
    },
  ];

  step1 = this.fb.group({
    nom: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s-]+$/)]],
    prenom: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s-]+$/)],
    ],
    dateNaissance: ['', Validators.required],
    nationalite: ['', Validators.required],
    sexe: ['MASCULIN', Validators.required],
    typePiece: ['CNI', Validators.required],
  });

  step3 = this.fb.group({
    dernierEtablissement: ['', Validators.required],
    specialisation: ['', Validators.required],
    periodeFormation: ['', Validators.required],
  });

  step4 = this.fb.group({
    telephone: [
      '',
      [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)],
    ],
    adresse: ['', Validators.required],
    contactUrgenceNom: ['', Validators.required],
    contactUrgenceTel: ['', Validators.required],
  });

  ngOnInit() {
    this.dossierService.monDossier().subscribe({
      next: (d) => {
        this.dossierId.set(d.id);
        this.etapeActuelle.set(d.etapeActuelle - 1);
      },
      error: () => {},
    });
  }

  estFichierUploade(type: string): boolean {
    return this.fichiersUploades()[type] === true;
  }

  estEnCours(type: string): boolean {
    return this.fichiersEnCours()[type] === true;
  }

  tousDocumentsRequis(): boolean {
    return this.documentsRequis
      .filter((d) => d.required)
      .every((d) => this.estFichierUploade(d.type));
  }

  onFileSelected(event: Event, type: TypeDocument) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.dossierId()) return;

    this.fichiersEnCours.update((f) => ({ ...f, [type]: true }));
    this.erreur.set('');

    this.documentService.uploader(this.dossierId()!, type, file).subscribe({
      next: () => {
        this.fichiersUploades.update((f) => ({ ...f, [type]: true }));
        this.fichiersEnCours.update((f) => ({ ...f, [type]: false }));
      },
      error: () => {
        this.fichiersEnCours.update((f) => ({ ...f, [type]: false }));
        this.erreur.set("Erreur lors de l'upload de " + type);
      },
    });
  }

  etapeSuivante() {
    this.erreur.set('');

    if (this.etapeActuelle() === 0) {
      if (this.step1.invalid) {
        this.step1.markAllAsTouched();
        return;
      }
      this.soumettreStep1();
      return;
    }
    if (this.etapeActuelle() === 1) {
      if (!this.tousDocumentsRequis()) {
        this.erreur.set('Veuillez uploader tous les documents obligatoires');
        return;
      }
    }
    if (this.etapeActuelle() === 2) {
      if (this.step3.invalid) {
        this.step3.markAllAsTouched();
        return;
      }
    }
    if (this.etapeActuelle() === 3) {
      if (this.step4.invalid) {
        this.step4.markAllAsTouched();
        return;
      }
    }

    this.etapeActuelle.update((e) => e + 1);
  }

  etapePrecedente() {
    if (this.etapeActuelle() > 0) this.etapeActuelle.update((e) => e - 1);
  }

  soumettreStep1() {
    this.loading.set(true);

    if (this.dossierId()) {
      this.etapeActuelle.update((e) => e + 1);
      this.loading.set(false);
      return;
    }

    const val = this.step1.value;
    this.dossierService
      .creer({
        nom: val.nom!.trim(),
        prenom: val.prenom!.trim(),
        dateNaissance: val.dateNaissance!,
        nationalite: val.nationalite!.trim(),
        sexe: val.sexe as any,
        typePiece: val.typePiece as any,
        telephone: '0000000000',
      })
      .subscribe({
        next: (d) => {
          this.dossierId.set(d.id);
          this.loading.set(false);
          this.etapeActuelle.update((e) => e + 1);
        },
        error: (err) => {
          this.loading.set(false);
          this.erreur.set(err.error?.message ?? 'Erreur création dossier');
        },
      });
  }

  soumettreDossier() {
    if (!this.dossierId()) return;
    this.loading.set(true);
    this.erreur.set('');

    // 5 documents uploadés = 100%, on force 85% minimum si tous uploadés
    const nbDocs = this.getNbDocumentsUploades();
    const score = nbDocs >= 5 ? 85 : Math.round((nbDocs / 5) * 80);

    this.dossierService.mettreAJourScore(this.dossierId()!, score).subscribe({
      next: () => {
        this.dossierService.soumettre(this.dossierId()!).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/candidat/dashboard']);
          },
          error: (err) => {
            this.loading.set(false);
            this.erreur.set(
              err.error?.message ?? 'Erreur lors de la soumission',
            );
          },
        });
      },
      error: () => {
        // Score update failed, try submit anyway
        this.dossierService.soumettre(this.dossierId()!).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/candidat/dashboard']);
          },
          error: (err) => {
            this.loading.set(false);
            this.erreur.set(
              err.error?.message ?? 'Erreur lors de la soumission',
            );
          },
        });
      },
    });
  }

  isInvalid(form: any, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getNbDocumentsUploades(): number {
    return this.documentsRequis.filter((d) => this.estFichierUploade(d.type))
      .length;
  }

  getProgressionDocuments(): number {
    return (this.getNbDocumentsUploades() / this.documentsRequis.length) * 100;
  }

  getAcceptParType(type: TypeDocument): string {
    const imageOnly = ['CNI_RECTO', 'CNI_VERSO', 'PHOTO_IDENTITE'];
    return imageOnly.includes(type)
      ? 'image/jpeg,image/png'
      : 'application/pdf,image/jpeg,image/png';
  }
}
