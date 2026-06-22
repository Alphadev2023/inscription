import api from "./axiosInstance"
import type { FichierDocument } from "@/domain/models"

export const documentApi = {
  upload: async (dossierId: string, type: string, file: File): Promise<FichierDocument> => {
    const formData = new FormData()
    formData.append("fichier", file)
    formData.append("dossierId", dossierId)
    formData.append("type", type)
    const res = await api.post<FichierDocument>("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },
  valider: async (id: string): Promise<FichierDocument> => {
    const res = await api.post<FichierDocument>(`/documents/${id}/valider`, null, {
      params: { approuve: true }
    })
    return res.data
  },
  rejeter: async (id: string, raison: string): Promise<FichierDocument> => {
    const res = await api.post<FichierDocument>(`/documents/${id}/valider`, null, {
      params: { approuve: false, raisonRejet: raison }
    })
    return res.data
  },
  getByDossier: async (dossierId: string): Promise<FichierDocument[]> => {
    const res = await api.get<FichierDocument[]>(`/documents/dossier/${dossierId}`)
    return res.data
  },
  telecharger: (id: string): string => {
    return `/api/documents/${id}/telecharger`
  },
}
