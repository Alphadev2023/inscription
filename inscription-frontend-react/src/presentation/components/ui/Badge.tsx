import { StatutDossier, StatutValidation } from "@/domain/enums"

interface Props {
  statut: StatutDossier | StatutValidation | string
}

const config: Record<string, { label: string; className: string }> = {
  BROUILLON:  { label: "Brouillon",  className: "bg-neutral-100 text-neutral-600" },
  SOUMIS:     { label: "Soumis",     className: "bg-primary-100 text-primary-600" },
  EN_COURS:   { label: "En cours",   className: "bg-warning-100 text-warning-600" },
  VALIDE:     { label: "Validé",     className: "bg-success-100 text-success-600" },
  REJETE:     { label: "Rejeté",     className: "bg-danger-100 text-danger-600" },
  EN_ATTENTE: { label: "En attente", className: "bg-neutral-100 text-neutral-600" },
}

export default function Badge({ statut }: Props) {
  const c = config[statut] ?? { label: statut, className: "bg-neutral-100 text-neutral-600" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}
