import api from "./axiosInstance"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/domain/models"

interface BackendAuthResponse {
  accessToken: string
  refreshToken: string
  role: string
}

function parseJwt(token: string): Record<string, string> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64)) as Record<string, string>
  } catch {
    return {}
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<BackendAuthResponse>("/auth/login", data)
    const claims = parseJwt(res.data.accessToken)
    return {
      token: res.data.accessToken,
      email: claims["email"] ?? data.email,
      role: res.data.role as AuthResponse["role"],
      userId: claims["sub"] ?? "",
    }
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<BackendAuthResponse>("/auth/register", data)
    const claims = parseJwt(res.data.accessToken)
    return {
      token: res.data.accessToken,
      email: claims["email"] ?? data.email,
      role: res.data.role as AuthResponse["role"],
      userId: claims["sub"] ?? "",
    }
  },
}
