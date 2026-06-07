export interface User {
  id: string;
  email: string;
  role: 'CANDIDAT' | 'AGENT' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  email: string;
  motDePasse: string;
  role?: string;
}
