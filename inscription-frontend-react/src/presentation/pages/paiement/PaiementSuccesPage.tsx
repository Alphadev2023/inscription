import { useSearchParams } from "react-router-dom";
import {
  usePaiementBySession,
  useTelechargerRecu,
} from "@/application/hooks/paiement/usePaiement";

export function PaiementSuccesPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: paiement, isLoading } = usePaiementBySession(sessionId);
  const { mutate: telecharger, isPending } = useTelechargerRecu();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
        <h1 className="text-xl font-bold text-success-600 mb-2">
          Paiement reussi
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Votre inscription a ete validee et payee avec succes.
        </p>
        {isLoading && <p className="text-sm text-gray-400">Chargement...</p>}
        {paiement && (
          <button
            onClick={() =>
              telecharger({
                paiementId: paiement.id,
                numeroRecu: paiement.numeroRecu ?? "recu",
              })
            }
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? "Telechargement..." : "Telecharger le recu (PDF)"}
          </button>
        )}
      </div>
    </div>
  );
}
