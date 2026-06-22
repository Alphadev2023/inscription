import { useMonDossier } from "@/application/hooks/dossiers/useDossiers"
import Spinner from "@/presentation/components/ui/Spinner"
import Badge from "@/presentation/components/ui/Badge"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/infrastructure/store/authStore"
import { CheckCircle, Clock, FileText, Calendar } from "lucide-react"
import { StatutDossier } from "@/domain/enums"

const ETAPES = [
  { label: "Informations personnelles", desc: "Nom, prénom, date de naissance" },
  { label: "Documents officiels",       desc: "Diplômes, CNI, acte de naissance" },
  { label: "Parcours académique",       desc: "Etablissement, spécialisation" },
  { label: "Coordonnées",               desc: "Email, téléphone, adresse" },
  { label: "Récapitulatif",             desc: "Vérification et soumission" },
]

export default function CandidatDashboard() {
  const navigate = useNavigate()
  const email = useAuthStore((s) => s.email)
  const prenom = email?.split("@")[0] ?? "Candidat"
  const { data: dossier, isLoading } = useMonDossier()

  if (isLoading) return <Spinner />

  const etapeReelle = dossier?.statut === StatutDossier.SOUMIS || dossier?.statut === StatutDossier.VALIDE || dossier?.statut === StatutDossier.REJETE ? 5 : (dossier?.etapeActuelle ?? 1)
  const etape = etapeReelle
  const score = dossier?.scoreCompletude ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 capitalize">Bonjour, {prenom}</h1>
        <p className="text-neutral-500 text-sm">Bienvenue sur votre espace candidat</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-neutral-500 text-sm mb-1">Statut du dossier</p>
          <div className="flex items-center justify-between">
            {dossier ? <Badge statut={dossier.statut} /> : <span className="text-neutral-400 text-sm">Aucun dossier</span>}
            <FileText size={20} className="text-primary-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-neutral-500 text-sm mb-1">Complétion</p>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <div className="w-full bg-neutral-100 rounded-full h-2 mb-1">
                <div className="bg-success-500 h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
              </div>
              <p className="text-xl font-bold text-neutral-900">{score}%</p>
            </div>
            <CheckCircle size={20} className="text-success-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-neutral-500 text-sm mb-1">Etape actuelle</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-neutral-900">{etape}/5</p>
              <p className="text-xs text-neutral-400">{ETAPES[etape - 1]?.label}</p>
            </div>
            <Clock size={20} className="text-warning-400" />
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900 mb-4">Progression de votre dossier</h2>
        <div className="space-y-3">
          {ETAPES.map((e, i) => {
            const num = i + 1
            const done = num < etape || dossier?.statut === StatutDossier.VALIDE || dossier?.statut === StatutDossier.SOUMIS || dossier?.statut === StatutDossier.REJETE || score >= 80
            const current = num === etape
            return (
              <div key={num} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? "bg-success-500" : current ? "bg-primary-500" : "bg-neutral-200"
                }`}>
                  {done
                    ? <CheckCircle size={16} className="text-white" />
                    : <span className="text-xs font-bold text-white">{num}</span>
                  }
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${done ? "text-neutral-900" : current ? "text-neutral-900" : "text-neutral-400"}`}>
                    {e.label}
                  </p>
                  <p className="text-xs text-neutral-400">{e.desc}</p>
                </div>
                {done && <span className="text-xs text-success-600 font-medium">Complété</span>}
                {current && !done && <span className="text-xs text-primary-600 font-medium">En cours</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Infos dossier */}
      {dossier && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">Informations du dossier</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-neutral-400" />
              <span className="text-neutral-500">Créé le</span>
              <span className="font-medium text-neutral-900">
                {new Date(dossier.creeLe).toLocaleString("fr-FR")}
              </span>
            </div>
            {dossier.soumisLe && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-success-400" />
                <span className="text-neutral-500">Soumis le</span>
                <span className="font-medium text-neutral-900">
                  {new Date(dossier.soumisLe).toLocaleString("fr-FR")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      {!dossier && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
          <FileText size={32} className="text-primary-400 mx-auto mb-3" />
          <p className="text-neutral-900 font-semibold mb-1">Commencez votre inscription</p>
          <p className="text-neutral-500 text-sm mb-4">Complétez votre dossier en 5 étapes</p>
          <button
            onClick={() => navigate("/candidat/inscription")}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Démarrer mon inscription
          </button>
        </div>
      )}

      {dossier && dossier.statut === StatutDossier.BROUILLON && (
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/candidat/inscription")}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Continuer mon inscription
          </button>
        </div>
      )}

      {dossier?.statut === StatutDossier.VALIDE && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success-500" />
          <p className="text-success-700 text-sm font-medium">
            Félicitations ! Votre dossier a été validé par notre équipe. Vous serez contacté prochainement.
          </p>
        </div>
      )}

      {dossier?.statut === StatutDossier.REJETE && (
        <div className="bg-danger-50 border border-danger-200 rounded-xl p-4">
          <p className="text-danger-600 text-sm font-medium">Dossier rejeté</p>
          {dossier.raisonRejet && <p className="text-danger-700 text-sm mt-1">{dossier.raisonRejet}</p>}
        </div>
      )}
    </div>
  )
}
