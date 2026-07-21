import api from "./axiosInstance";
import type {
  CreerPaiementRequest,
  CreerPaiementResponse,
  Paiement,
} from "@/domain/models";

export const paiementApi = {
  creerCheckout: async (
    data: CreerPaiementRequest,
  ): Promise<CreerPaiementResponse> => {
    const res = await api.post<CreerPaiementResponse>(
      "/paiements/checkout",
      data,
    );
    return res.data;
  },

  getBySessionId: async (sessionId: string): Promise<Paiement> => {
    const res = await api.get<Paiement>(`/paiements/by-session/${sessionId}`);
    return res.data;
  },

  telechargerRecu: async (
    paiementId: string,
    numeroRecu: string,
  ): Promise<void> => {
    const res = await api.get(`/paiements/${paiementId}/recu`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `recu-${numeroRecu}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
