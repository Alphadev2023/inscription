import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/infrastructure/api/adminApi"
import { useDossiers } from "@/application/hooks/dossiers/useDossiers"
import Spinner from "@/presentation/components/ui/Spinner"
import { FolderOpen, Clock, RefreshCw, CheckCircle, XCircle, FileText, CheckSquare, XSquare } from "lucide-react"
import { StatutDossier } from "@/domain/enums"

export default function AdminStats() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getDashboardStats,
  })
  const { data: dossiers, isLoading: loadingDossiers } = useDossiers()

  if (loadingStats || loadingDossiers) return <Spinner />

  const total = stats?.totalDossiers ?? 0

  const parStatut = [
    { label: "Soumis",     value: stats?.soumis ?? 0,     statut: StatutDossier.SOUMIS,     color: "bg-primary-500" },
    { label: "En cours",   value: stats?.enCours ?? 0,    statut: StatutDossier.EN_COURS,    color: "bg-warning-500" },
    { label: "Validés",    value: stats?.valides ?? 0,    statut: StatutDossier.VALIDE,      color: "bg-success-500" },
    { label: "Rejetés",    value: stats?.rejetes ?? 0,    statut: StatutDossier.REJETE,      color: "bg-danger-500" },
    { label: "Brouillons", value: stats?.brouillons ?? 0, statut: StatutDossier.BROUILLON,   color: "bg-neutral-400" },
  ]

  // Dossiers par mois
  const parMois: Record<string, number> = {}
  dossiers?.forEach((d) => {
    const mois = d.creeLe.substring(0, 7)
    parMois[mois] = (parMois[mois] ?? 0) + 1
  })
  const maxMois = Math.max(...Object.values(parMois), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Statistiques</h1>
        <p className="text-neutral-500 text-sm">Vue analytique de la plateforme d&apos;inscription</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total dossiers", value: total,               icon: FolderOpen,  color: "text-primary-500", sub: "100% du total" },
          { label: "Soumis",         value: stats?.soumis ?? 0,  icon: Clock,        color: "text-primary-500", sub: `${total ? (((stats?.soumis ?? 0)/total)*100).toFixed(0) : 0}% du total` },
          { label: "En cours",       value: stats?.enCours ?? 0, icon: RefreshCw,    color: "text-warning-500", sub: `${total ? (((stats?.enCours ?? 0)/total)*100).toFixed(0) : 0}% du total` },
          { label: "Validés",        value: stats?.valides ?? 0, icon: CheckCircle,  color: "text-success-500", sub: `${total ? (((stats?.valides ?? 0)/total)*100).toFixed(0) : 0}% du total` },
          { label: "Rejetés",        value: stats?.rejetes ?? 0, icon: XCircle,      color: "text-danger-500",  sub: `${total ? (((stats?.rejetes ?? 0)/total)*100).toFixed(0) : 0}% du total` },
          { label: "Brouillons",     value: stats?.brouillons ?? 0, icon: FileText,  color: "text-neutral-500", sub: `${total ? (((stats?.brouillons ?? 0)/total)*100).toFixed(0) : 0}% du total` },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-neutral-500 text-sm">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-400 mt-1">{sub}</p>
            <div className="w-full bg-neutral-100 rounded-full h-1 mt-2">
              <div className={`${color.replace("text-", "bg-")} h-1 rounded-full`}
                style={{ width: `${total ? (value/total)*100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Taux */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Taux de validation", value: `${(stats?.tauxValidation ?? 0).toFixed(0)}%`, icon: CheckSquare, color: "text-success-500" },
          { label: "Taux de rejet",      value: `${(stats?.tauxRejet ?? 0).toFixed(0)}%`,      icon: XSquare,     color: "text-danger-500"  },
          { label: "Score moyen",        value: `${(stats?.scoreMoyen ?? 0).toFixed(0)}%`,     icon: FolderOpen,  color: "text-primary-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col items-center justify-center py-8">
            <Icon size={28} className={color} />
            <p className={`text-4xl font-bold mt-3 ${color}`}>{value}</p>
            <p className="text-neutral-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Dossiers par mois */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900 mb-4">Dossiers créés par mois</h2>
        <div className="space-y-2">
          {Object.entries(parMois).sort().map(([mois, count]) => (
            <div key={mois} className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 w-16">{mois}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-5 relative">
                <div
                  className="bg-primary-500 h-5 rounded-full transition-all"
                  style={{ width: `${(count / maxMois) * 100}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par statut */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900 mb-4">Répartition par statut</h2>
        <div className="space-y-2">
          {parStatut.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 w-20">{label}</span>
              <div className="flex-1 bg-neutral-100 rounded-full h-3">
                <div
                  className={`${color} h-3 rounded-full transition-all`}
                  style={{ width: `${total ? (value / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500 w-16 text-right">
                {value} ({total ? ((value/total)*100).toFixed(0) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
