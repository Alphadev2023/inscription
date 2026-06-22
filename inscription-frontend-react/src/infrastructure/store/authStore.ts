import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role } from "@/domain/enums"

interface AuthState {
  token: string | null
  email: string | null
  role: Role | null
  userId: string | null
  isAuthenticated: boolean
  setAuth: (token: string, email: string, role: Role, userId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      role: null,
      userId: null,
      isAuthenticated: false,
      setAuth: (token, email, role, userId) => {
        localStorage.setItem("token", token)
        set({ token, email, role, userId, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem("token")
        set({ token: null, email: null, role: null, userId: null, isAuthenticated: false })
      },
    }),
    { name: "auth-store" }
  )
)
