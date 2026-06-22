import api from "./axiosInstance"
import type { Workflow } from "@/domain/models"

export interface WorkflowStats {
  totalWorkflows: number
  enAttente: number
  enCours: number
  termines: number
}

export const workflowApi = {
  getStats: async (): Promise<WorkflowStats> => {
    const res = await api.get<WorkflowStats>("/workflow/stats")
    return res.data
  },
  assignerAgent: async (dossierId: string, agentId: string): Promise<Workflow> => {
    const res = await api.post<Workflow>(`/workflow/assigner`, { dossierId, agentId })
    return res.data
  },
  getByDossier: async (dossierId: string): Promise<Workflow> => {
    const res = await api.get<Workflow>(`/workflow/dossier/${dossierId}`)
    return res.data
  },
}
