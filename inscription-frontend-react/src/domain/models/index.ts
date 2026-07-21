import type {
  Role,
  StatutDossier,
  StatutValidation,
  TypeDocument,
  Sexe,
  TypePieceIdentite,
  Priorite,
  StatutPaiement,
} from "@/domain/enums";

export interface Utilisateur {
  id: string;
  email: string;
  role: Role;
  actif: boolean;
  creeLe: string;
}

export interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  nationalite?: string;
  telephone?: string;
  adresse?: string;
  sexe?: Sexe;
  typePiece?: TypePieceIdentite;
  numeroIdentite?: string;
  contactUrgenceNom?: string;
  contactUrgenceTelephone?: string;
}

export interface FichierDocument {
  id: string;
  dossierId: string;
  type: TypeDocument;
  nomFichierOriginal?: string;
  nomFichierStockage?: string;
  mimeType?: string;
  taille?: number;
  statut: StatutValidation;
  raisonRejet?: string;
  uploadeLe: string;
  valideLe?: string;
}

export interface DossierInscription {
  id: string;
  utilisateurId: string;
  candidat?: Candidat;
  statut: StatutDossier;
  scoreCompletude: number;
  etapeActuelle: number;
  dernierEtablissement?: string;
  specialisation?: string;
  periodeFormation?: string;
  agentAssigneId?: string;
  creeLe: string;
  soumisLe?: string;
  traiteLe?: string;
  raisonRejet?: string;
  documents?: FichierDocument[];
}

export interface DossierSummary {
  id: string;
  nomCandidat: string;
  prenomCandidat: string;
  statut: StatutDossier;
  scoreCompletude: number;
  etapeActuelle: number;
  creeLe: string;
}

export interface Workflow {
  id: string;
  dossierId: string;
  agentId?: string;
  priorite: Priorite;
  statutCourant: StatutDossier;
  dateAssignation?: string;
  dateEcheance?: string;
  nbRelances: number;
}

export interface Notification {
  id: string;
  utilisateurId: string;
  type: string;
  sujet?: string;
  contenu?: string;
  envoye: boolean;
  envoyeLe?: string;
  creeLe: string;
}

export interface WsNotification {
  type: string;
  message: string;
  dossierId?: string;
  statut?: StatutDossier;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: Role;
  userId: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  email: string;
  motDePasse: string;
  role: Role;
}

export interface DashboardStats {
  totalDossiers: number;
  soumis: number;
  enCours: number;
  valides: number;
  rejetes: number;
  brouillons: number;
  tauxValidation: number;
  tauxRejet: number;
  scoreMoyen: number;
}

export interface Paiement {
  id: string;
  inscriptionId: string;
  montant: number;
  devise: string;
  statut: StatutPaiement;
  stripeSessionId?: string;
  numeroRecu?: string;
  dateCreation: string;
  datePaiement?: string;
}

export interface CreerPaiementRequest {
  inscriptionId: string;
  montant: number;
  libelle: string;
}

export interface CreerPaiementResponse {
  url: string;
}
