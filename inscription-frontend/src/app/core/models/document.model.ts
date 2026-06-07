export type TypeDocument =
  | 'DIPLOME_BAC'
  | 'DIPLOME_SUPERIEUR'
  | 'CNI_RECTO'
  | 'CNI_VERSO'
  | 'ACTE_NAISSANCE'
  | 'PHOTO_IDENTITE';

export type StatutValidation = 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'SUSPECT';

export interface DocumentResponse {
  id: string;
  dossierId: string;
  type: TypeDocument;
  nomFichierOriginal: string;
  mimeType: string;
  taille: number;
  statut: StatutValidation;
  raisonRejet?: string;
  uploadeLe: string;
}
