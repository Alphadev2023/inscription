import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/infrastructure/store/authStore"
import type { Role } from "@/domain/enums"

interface Props {
  children: React.ReactNode
  roles?: Role[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && role && !roles.includes(role)) return <Navigate to="/unauthorized" replace />

  return <>{children}</>
}
