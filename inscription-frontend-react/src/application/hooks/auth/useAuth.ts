import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authApi } from "@/infrastructure/api/authApi"
import { useAuthStore } from "@/infrastructure/store/authStore"
import { Role } from "@/domain/enums"
import type { LoginRequest, RegisterRequest } from "@/domain/models"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.token, res.email, res.role, res.userId)
      if (res.role === Role.ADMIN) navigate("/admin/dashboard")
      else if (res.role === Role.AGENT) navigate("/agent/dashboard")
      else navigate("/candidat/dashboard")
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.token, res.email, res.role, res.userId)
      if (res.role === Role.ADMIN) navigate("/admin/dashboard")
      else if (res.role === Role.AGENT) navigate("/agent/dashboard")
      else navigate("/candidat/dashboard")
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return () => {
    logout()
    navigate("/login")
  }
}