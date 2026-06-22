import api from "./axiosInstance"
import type { DossierInscription, DossierSummary } from "@/domain/models"

export interface CreerDossierRequest {
  nom: string
  prenom: string
  dateNaissance: string
  nationalite: string
  telephone: string
  sexe: string
  typePiece: string
}

export interface SoumettreDossierRequest {
  dernierEtablissement?: string
  specialisation?: string
  periodeFormation?: string
}

export const dossierApi = {
  getAll: async (): Promise<DossierSummary[]> => {
    const res = await api.get<DossierSummary[]>("/dossiers")
    return res.data
  },
  getById: async (id: string): Promise<DossierInscription> => {
    const res = await api.get<DossierInscription>(`/dossiers/${id}`)
    return res.data
  },
  getMien: async (): Promise<DossierInscription> => {
    const res = await api.get<DossierInscription>("/dossiers/mon-dossier")
    return res.data
  },
  creer: async (data: CreerDossierRequest): Promise<DossierInscription> => {
    const res = await api.post<DossierInscription>("/dossiers", data)
    return res.data
  },
  soumettre: async (id: string, data: SoumettreDossierRequest): Promise<DossierInscription> => {
    const res = await api.post<DossierInscription>(`/dossiers/${id}/soumettre`, data)
    return res.data
  },
  valider: async (id: string): Promise<DossierInscription> => {
    const res = await api.post<DossierInscription>(`/dossiers/${id}/valider`)
    return res.data
  },
  mettreAJourScore: async (id: string, score: number): Promise<DossierInscription> => {
    const res = await api.put<DossierInscription>(`/dossiers/${id}/score`, null, { params: { score } })
    return res.data
  },
  rejeter: async (id: string, raison: string): Promise<DossierInscription> => {
    const res = await api.post<DossierInscription>(`/dossiers/${id}/rejeter`, null, { params: { raison } })
    return res.data
  },
}
