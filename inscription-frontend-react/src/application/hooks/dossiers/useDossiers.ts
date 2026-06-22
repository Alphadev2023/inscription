import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dossierApi } from "@/infrastructure/api/dossierApi"
import type { CreerDossierRequest, SoumettreDossierRequest } from "@/infrastructure/api/dossierApi"

export const DOSSIER_KEYS = {
  all: ["dossiers"] as const,
  detail: (id: string) => ["dossiers", id] as const,
  mien: ["dossiers", "mon-dossier"] as const,
}

export function useDossiers() {
  return useQuery({
    queryKey: DOSSIER_KEYS.all,
    queryFn: dossierApi.getAll,
  })
}

export function useDossier(id: string) {
  return useQuery({
    queryKey: DOSSIER_KEYS.detail(id),
    queryFn: () => dossierApi.getById(id),
    enabled: !!id,
  })
}

export function useMonDossier() {
  return useQuery({
    queryKey: DOSSIER_KEYS.mien,
    queryFn: async () => {
      try {
        return await dossierApi.getMien()
      } catch {
        return null
      }
    },
    retry: false,
  })
}

export function useCreerDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreerDossierRequest) => dossierApi.creer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.all })
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.mien })
    },
  })
}

export function useSoumettreDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SoumettreDossierRequest }) =>
      dossierApi.soumettre(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.mien })
    },
  })
}

export function useValiderDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => dossierApi.valider(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOSSIER_KEYS.all }),
  })
}

export function useRejeterDossier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, raison }: { id: string; raison: string }) =>
      dossierApi.rejeter(id, raison),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOSSIER_KEYS.all }),
  })
}
