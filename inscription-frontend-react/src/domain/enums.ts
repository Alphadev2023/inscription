export enum Role {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  CANDIDAT = "CANDIDAT",
}

export enum StatutDossier {
  BROUILLON = "BROUILLON",
  SOUMIS = "SOUMIS",
  EN_COURS = "EN_COURS",
  VALIDE = "VALIDE",
  REJETE = "REJETE",
}

export enum StatutValidation {
  EN_ATTENTE = "EN_ATTENTE",
  VALIDE = "VALIDE",
  REJETE = "REJETE",
}

export enum TypeDocument {
  DIPLOME_BAC = "DIPLOME_BAC",
  DIPLOME_SUPERIEUR = "DIPLOME_SUPERIEUR",
  CNI_RECTO = "CNI_RECTO",
  CNI_VERSO = "CNI_VERSO",
  ACTE_NAISSANCE = "ACTE_NAISSANCE",
  PHOTO_IDENTITE = "PHOTO_IDENTITE",
}

export enum Sexe {
  MASCULIN = "MASCULIN",
  FEMININ = "FEMININ",
}

export enum TypePieceIdentite {
  CNI = "CNI",
  PASSEPORT = "PASSEPORT",
  ACTE_NAISSANCE = "ACTE_NAISSANCE",
}

export enum Priorite {
  BASSE = "BASSE",
  NORMALE = "NORMALE",
  HAUTE = "HAUTE",
  URGENTE = "URGENTE",
}

export enum TypeNotification {
  EMAIL = "EMAIL",
  WEBSOCKET = "WEBSOCKET",
}

export enum StatutPaiement {
  EN_ATTENTE = "EN_ATTENTE",
  PAYE = "PAYE",
  ECHEC = "ECHEC",
  REMBOURSE = "REMBOURSE",
}