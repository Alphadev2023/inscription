import api from "./axiosInstance"
import type { Utilisateur, DashboardStats } from "@/domain/models"

export const adminApi = {
  getUtilisateurs: async (): Promise<Utilisateur[]> => {
    const res = await api.get<Utilisateur[]>("/admin/utilisateurs")
    return res.data
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>("/admin/stats")
    return res.data
  },
  getAgents: async (): Promise<Utilisateur[]> => {
    const res = await api.get<Utilisateur[]>("/admin/agents")
    return res.data
  },
}
