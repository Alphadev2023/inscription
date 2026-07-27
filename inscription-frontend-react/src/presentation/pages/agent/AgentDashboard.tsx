import { useDossiers } from "@/application/hooks/dossiers/useDossiers"
import { useValiderDossier, useRejeterDossier } from "@/application/hooks/dossiers/useDossiers"
import Spinner from "@/presentation/components/ui/Spinner"
import Badge from "@/presentation/components/ui/Badge"
import { useState } from "react"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { StatutDossier } from "@/domain/enums"
import { useNavigate } from "react-router-dom"

export default function AgentDashboard() {
  const navigate = useNavigate()
  const { data: dossiers, isLoading } = useDossiers()
  const valider = useValiderDossier()
  const rejeter = useRejeterDossier()
  const [raisonRejet, setRaisonRejet] = useState("")
  const [rejetId, setRejetId] = useState<string | null>(null)

  if (isLoading) return <Spinner />

  const aTraiter = dossiers?.filter((d) =>
    d.statut === StatutDossier.SOUMIS || d.statut === StatutDossier.EN_COURS
  ) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord Agent</h1>
        <p className="text-neutral-500 text-sm">Dossiers a traiter</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",     value: dossiers?.length ?? 0,                                               color: "text-primary-500" },
          { label: "A traiter", value: aTraiter.length,                                                     color: "text-warning-500" },
          { label: "Traites",   value: (dossiers?.length ?? 0) - aTraiter.length,                          color: "text-success-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 p-5">
            <p className="text-neutral-500 text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900 mb-4">Dossiers en attente de traitement</h2>
        {aTraiter.length === 0 ? (
          <p className="text-neutral-400 text-sm text-center py-8">Aucun dossier a traiter</p>
        ) : (
          <div className="space-y-3">
            {aTraiter.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                    {d.nomCandidat.charAt(0)}{d.prenomCandidat.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{d.nomCandidat} {d.prenomCandidat}</p>
                    <p className="text-xs text-neutral-400">{new Date(d.creeLe).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge statut={d.statut} />
                  <button onClick={() => navigate(`/agent/dossiers/${d.id}`)}
                    className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => valider.mutate(d.id)}
                    disabled={valider.isPending}
                    className="p-1.5 hover:bg-success-50 rounded text-success-500 transition-colors">
                    <CheckCircle size={14} />
                  </button>
                  <button onClick={() => setRejetId(d.id)}
                    className="p-1.5 hover:bg-danger-50 rounded text-danger-500 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rejetId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Rejeter le dossier</h3>
            <textarea value={raisonRejet} onChange={(e) => setRaisonRejet(e.target.value)}
              rows={4} placeholder="Raison du rejet..."
              className="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger-500 resize-none" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setRejetId(null); setRaisonRejet("") }}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                Annuler
              </button>
              <button
                onClick={() => rejeter.mutate({ id: rejetId, raison: raisonRejet }, { onSuccess: () => { setRejetId(null); setRaisonRejet("") } })}
                disabled={rejeter.isPending || !raisonRejet.trim()}
                className="flex-1 px-4 py-2 bg-danger-500 hover:bg-danger-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                {rejeter.isPending ? "Rejet..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

