import { FolderOpen, Clock, RefreshCw, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/infrastructure/api/adminApi"
import { useDossiers } from "@/application/hooks/dossiers/useDossiers"
import StatCard from "@/presentation/components/ui/StatCard"
import Badge from "@/presentation/components/ui/Badge"
import Spinner from "@/presentation/components/ui/Spinner"
import { useNavigate } from "react-router-dom"
import { StatutDossier } from "@/domain/enums"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getDashboardStats,
  })
  const { data: dossiers, isLoading: loadingDossiers } = useDossiers()

  if (loadingStats || loadingDossiers) return <Spinner />

  const recents = dossiers?.slice(0, 5) ?? []
  const tauxValidation = stats?.tauxValidation ?? 0
  const tauxRejet = stats?.tauxRejet ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tableau de bord</h1>
        <p className="text-neutral-500 text-sm">Vue d&apos;ensemble de la plateforme d&apos;inscription</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total dossiers" value={stats?.totalDossiers ?? 0} icon={FolderOpen} color="primary" />
        <StatCard label="Soumis"          value={stats?.soumis ?? 0}        icon={Clock}        color="primary" />
        <StatCard label="En cours"        value={stats?.enCours ?? 0}       icon={RefreshCw}    color="warning" />
        <StatCard label="Validés"         value={stats?.valides ?? 0}       icon={CheckCircle}  color="success" />
        <StatCard label="Rejetés"         value={stats?.rejetes ?? 0}       icon={XCircle}      color="danger"  />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Dossiers récents */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900">Dossiers récents</h2>
            <button
              onClick={() => navigate("/admin/dossiers")}
              className="text-primary-600 text-sm flex items-center gap-1 hover:underline"
            >
              Voir tous <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recents.map((d) => (
              <div
                key={d.id}
                onClick={() => navigate(`/admin/dossiers/${d.id}`)}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50 rounded px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                    {d.nomCandidat.charAt(0)}{d.prenomCandidat.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{d.nomCandidat} {d.prenomCandidat}</p>
                    <p className="text-xs text-neutral-400">{new Date(d.creeLe).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge statut={d.statut} />
                  <ArrowRight size={14} className="text-neutral-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taux + Dossiers en attente */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Taux de validation</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Validés</span>
                  <span className="font-medium text-success-600">{stats?.valides ?? 0}/{stats?.totalDossiers ?? 0}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full transition-all" style={{ width: `${tauxValidation}%` }} />
                </div>
                <p className="text-right text-sm font-bold text-success-600 mt-1">{tauxValidation.toFixed(0)}%</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Rejetés</span>
                  <span className="font-medium text-danger-600">{stats?.rejetes ?? 0}/{stats?.totalDossiers ?? 0}</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className="bg-danger-500 h-2 rounded-full transition-all" style={{ width: `${tauxRejet}%` }} />
                </div>
                <p className="text-right text-sm font-bold text-danger-600 mt-1">{tauxRejet.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-neutral-900 mb-4">Dossiers en attente</h2>
            <div className="space-y-2">
              {[
                { label: "Soumis",    value: stats?.soumis ?? 0,    statut: StatutDossier.SOUMIS },
                { label: "En cours",  value: stats?.enCours ?? 0,   statut: StatutDossier.EN_COURS },
                { label: "Brouillon", value: stats?.brouillons ?? 0, statut: StatutDossier.BROUILLON },
              ].map(({ label, value, statut }) => (
                <div key={statut} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <Badge statut={statut} />
                  <span className="font-bold text-neutral-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
