import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { documentApi } from "@/infrastructure/api/documentApi"
import { DOSSIER_KEYS } from "@/application/hooks/dossiers/useDossiers"

export function useDocuments(dossierId: string) {
  return useQuery({
    queryKey: ["documents", dossierId],
    queryFn: () => documentApi.getByDossier(dossierId),
    enabled: !!dossierId,
  })
}

export function useUploadDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dossierId, type, file }: { dossierId: string; type: string; file: File }) =>
      documentApi.upload(dossierId, type, file),
    onSuccess: (_, { dossierId }) => {
      qc.invalidateQueries({ queryKey: ["documents", dossierId] })
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.mien })
    },
  })
}

export function useValiderDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => documentApi.valider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] })
      qc.invalidateQueries({ queryKey: ["dossiers"] })
    },
  })
}

export function useRejeterDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, raison }: { id: string; raison: string }) =>
      documentApi.rejeter(id, raison),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] })
      qc.invalidateQueries({ queryKey: ["dossiers"] })
    },
  })
}
