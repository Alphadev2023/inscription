import { useCreerCheckout } from "@/application/hooks/paiement/usePaiement";

interface PaiementButtonProps {
  inscriptionId: string;
  montant: number;
  libelle: string;
}

export function PaiementButton({
  inscriptionId,
  montant,
  libelle,
}: PaiementButtonProps) {
  const { mutate, isPending } = useCreerCheckout();

  return (
    <button
      onClick={() => mutate({ inscriptionId, montant, libelle })}
      disabled={isPending}
      className="btn-primary"
    >
      {isPending ? "Redirection..." : `Payer ${montant.toLocaleString()} F`}
    </button>
  );
}
