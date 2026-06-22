import { useNavigate } from "react-router-dom"
import { ShieldOff } from "lucide-react"

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <ShieldOff size={48} className="text-danger-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Acces refuse</h1>
        <p className="text-neutral-500 text-sm mb-6">Vous ne disposez pas des droits pour acceder a cette page.</p>
        <button onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          Retour
        </button>
      </div>
    </div>
  )
}
