import { useMutation, useQuery } from "@tanstack/react-query";
import { paiementApi } from "@/infrastructure/api/paiementApi";
import type { CreerPaiementRequest } from "@/domain/models";

export function useCreerCheckout() {
  return useMutation({
    mutationFn: (data: CreerPaiementRequest) => paiementApi.creerCheckout(data),
    onSuccess: (res) => {
      window.location.href = res.url;
    },
  });
}

export function usePaiementBySession(sessionId: string | null) {
  return useQuery({
    queryKey: ["paiement", "session", sessionId],
    queryFn: () => paiementApi.getBySessionId(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useTelechargerRecu() {
  return useMutation({
    mutationFn: ({
      paiementId,
      numeroRecu,
    }: {
      paiementId: string;
      numeroRecu: string;
    }) => paiementApi.telechargerRecu(paiementId, numeroRecu),
  });
}
