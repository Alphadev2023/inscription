import { useMonDossier } from "@/application/hooks/dossiers/useDossiers"
import Spinner from "@/presentation/components/ui/Spinner"
import Badge from "@/presentation/components/ui/Badge"
import { FileText, CheckCircle, User } from "lucide-react"
import { StatutDossier, StatutValidation } from "@/domain/enums"

export default function CandidatDossier() {
  const { data: dossier, isLoading } = useMonDossier()

  if (isLoading) return <Spinner />
  if (!dossier) return (
    <div className="text-center py-16">
      <FileText size={40} className="text-neutral-300 mx-auto mb-3" />
      <p className="text-neutral-500">Aucun dossier trouvé. Commencez votre inscription.</p>
    </div>
  )

  const candidat = dossier.candidat

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mon dossier</h1>
        <p className="text-neutral-500 text-sm">Consultez et gérez votre dossier d&apos;inscription</p>
      </div>

      {/* Header dossier */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <FileText size={22} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Dossier d&apos;inscription</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge statut={dossier.statut} />
                <span className="text-xs text-neutral-400">Etape {dossier.etapeActuelle}/5</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">{dossier.scoreCompletude}%</p>
            <p className="text-xs text-neutral-400">Complétion du dossier</p>
            <div className="w-32 bg-neutral-100 rounded-full h-1.5 mt-1">
              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${dossier.scoreCompletude}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-100 text-sm">
          <div>
            <p className="text-neutral-400 text-xs">ID Dossier</p>
            <p className="font-mono text-xs text-neutral-600 truncate">{dossier.id}</p>
          </div>
          <div>
            <p className="text-neutral-400 text-xs">Créé le</p>
            <p className="font-medium text-neutral-900">{new Date(dossier.creeLe).toLocaleString("fr-FR")}</p>
          </div>
          {dossier.soumisLe && (
            <div>
              <p className="text-neutral-400 text-xs">Soumis le</p>
              <p className="font-medium text-neutral-900">{new Date(dossier.soumisLe).toLocaleString("fr-FR")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bannière statut */}
      {dossier.statut === StatutDossier.VALIDE && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success-500" />
          <p className="text-success-700 text-sm font-medium">
            Félicitations ! Votre dossier a été validé par notre équipe. Vous serez contacté prochainement.
          </p>
        </div>
      )}
      {dossier.statut === StatutDossier.REJETE && (
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
          <p className="text-danger-600 font-medium text-sm">Dossier rejeté</p>
          {dossier.raisonRejet && <p className="text-danger-700 text-sm mt-1">{dossier.raisonRejet}</p>}
        </div>
      )}

      {/* Documents */}
      {dossier.documents && dossier.documents.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">
            Documents <span className="text-neutral-400 font-normal">{dossier.documents.length}/6</span>
          </h2>
          <div className="space-y-2">
            {dossier.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3">
                  {doc.statut === StatutValidation.VALIDE
                    ? <CheckCircle size={18} className="text-success-500" />
                    : <FileText size={18} className="text-neutral-400" />
                  }
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{doc.type.replace(/_/g, " ")}</p>
                    {doc.nomFichierOriginal && (
                      <p className="text-xs text-primary-500">{doc.nomFichierOriginal}
                        {doc.taille ? ` — ${(doc.taille / 1024).toFixed(1)} Ko` : ""}
                      </p>
                    )}
                  </div>
                </div>
                <Badge statut={doc.statut} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infos candidat */}
      {candidat && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <User size={16} /> Informations du candidat
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { label: "Nom",         value: candidat.nom },
              { label: "Prénom",      value: candidat.prenom },
              { label: "Naissance",   value: candidat.dateNaissance },
              { label: "Nationalité", value: candidat.nationalite },
              { label: "Sexe",        value: candidat.sexe },
              { label: "Téléphone",   value: candidat.telephone },
            ].map(({ label, value }) => value ? (
              <div key={label}>
                <p className="text-neutral-400 text-xs">{label}</p>
                <p className="font-medium text-neutral-900">{value}</p>
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  )
}
