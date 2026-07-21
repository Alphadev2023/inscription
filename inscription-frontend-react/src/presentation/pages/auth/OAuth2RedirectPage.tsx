import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "@/infrastructure/store/authStore"
import { Role } from "@/domain/enums"

function parseJwt(token: string): Record<string, string> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64)) as Record<string, string>
  } catch {
    return {}
  }
}

export default function OAuth2RedirectPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const token = searchParams.get("token")
    const role = searchParams.get("role") as Role | null

    if (!token || !role) {
      navigate("/login")
      return
    }

    const claims = parseJwt(token)
    setAuth(token, claims["email"] ?? "", role, claims["sub"] ?? "")

    if (role === Role.ADMIN) navigate("/admin/dashboard")
    else if (role === Role.AGENT) navigate("/agent/dashboard")
    else navigate("/candidat/dashboard")
  }, [searchParams, navigate, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar">
      <p className="text-white text-sm">Connexion en cours...</p>
    </div>
  )
}