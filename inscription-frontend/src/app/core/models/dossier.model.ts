export type StatutDossier =
  | 'BROUILLON'
  | 'SOUMIS'
  | 'EN_COURS'
  | 'VALIDE'
  | 'REJETE'
  | 'RECOURS';

export type Sexe = 'MASCULIN' | 'FEMININ' | 'NON_BINAIRE';
export type TypePiece = 'CNI' | 'PASSEPORT' | 'ACTE_NAISSANCE';

export interface DossierResponse {
  id: string;
  utilisateurId: string;
  nomCandidat: string;
  prenomCandidat: string;
  statut: StatutDossier;
  scoreCompletude: number;
  etapeActuelle: number;
  creeLe: string;
  soumisLe?: string;
}

export interface CreerDossierRequest {
  nom: string;
  prenom: string;
  dateNaissance: string;
  nationalite: string;
  telephone: string;
  sexe: Sexe;
  typePiece: TypePiece;
}

export interface DossierSummaryResponse {
  id: string;
  nomCandidat: string;
  prenomCandidat: string;
  statut: StatutDossier;
  scoreCompletude: number;
  etapeActuelle: number;
  creeLe: string;
}
