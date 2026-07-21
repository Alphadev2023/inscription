export function PaiementAnnulePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
        <h1 className="text-xl font-bold text-danger-600 mb-2">
          Paiement annule
        </h1>
        <p className="text-gray-600 text-sm">
          Le paiement n a pas ete finalise. Vous pouvez reessayer depuis votre
          dossier.
        </p>
      </div>
    </div>
  );
}
