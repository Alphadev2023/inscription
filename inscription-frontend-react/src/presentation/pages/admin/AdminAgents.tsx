import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/infrastructure/api/adminApi"
import Spinner from "@/presentation/components/ui/Spinner"
import { RefreshCw, UserCheck } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

export default function AdminAgents() {
  const qc = useQueryClient()
  const { data: agents, isLoading } = useQuery({
    queryKey: ["admin", "agents"],
    queryFn: adminApi.getAgents,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Agents</h1>
          <p className="text-neutral-500 text-sm">Gestion des agents de traitement</p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["admin", "agents"] })}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900 mb-4">
          Liste des agents <span className="text-neutral-400 font-normal">{agents?.length ?? 0}</span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {agents?.map((agent) => (
            <div key={agent.id} className="border border-neutral-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                  {agent.email.charAt(0).toUpperCase()}{agent.email.charAt(1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{agent.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.actif ? "bg-success-500" : "bg-neutral-300"}`} />
                    <span className="text-xs text-neutral-400">{agent.actif ? "Actif" : "Inactif"}</span>
                  </div>
                </div>
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded font-medium">
                  {agent.role}
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <UserCheck size={12} />
                Inscrit le {new Date(agent.creeLe).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
          {(!agents || agents.length === 0) && (
            <p className="text-neutral-400 text-sm col-span-3 text-center py-8">Aucun agent enregistré</p>
          )}
        </div>
      </div>
    </div>
  )
}
