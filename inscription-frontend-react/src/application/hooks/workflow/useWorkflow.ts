import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { workflowApi } from "@/infrastructure/api/workflowApi"
import { DOSSIER_KEYS } from "@/application/hooks/dossiers/useDossiers"

export function useWorkflowStats() {
  return useQuery({
    queryKey: ["workflow", "stats"],
    queryFn: workflowApi.getStats,
  })
}

export function useWorkflowByDossier(dossierId: string) {
  return useQuery({
    queryKey: ["workflow", "dossier", dossierId],
    queryFn: () => workflowApi.getByDossier(dossierId),
    enabled: !!dossierId,
  })
}

export function useAssignerAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dossierId, agentId }: { dossierId: string; agentId: string }) =>
      workflowApi.assignerAgent(dossierId, agentId),
    onSuccess: (_, { dossierId }) => {
      qc.invalidateQueries({ queryKey: DOSSIER_KEYS.detail(dossierId) })
      qc.invalidateQueries({ queryKey: ["workflow", "stats"] })
    },
  })
}
