import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Mail, Lock } from "lucide-react";
import { useLogin } from "@/application/hooks/auth/useAuth";

const schema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const login = useLogin();

  const onSubmit = (data: FormData) => login.mutate(data);

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white text-xl font-bold">Inscription</p>
            <p className="text-neutral-400 text-xs">Plateforme de gestion</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h1 className="text-xl font-bold text-neutral-900 mb-1">Connexion</h1>
          <p className="text-neutral-500 text-sm mb-6">
            Accedez a votre espace
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.email && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  {...register("motDePasse")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.motDePasse && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.motDePasse.message}
                </p>
              )}
            </div>

            {login.isError && (
              <p className="text-danger-500 text-sm text-center">
                Email ou mot de passe incorrect
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {login.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">ou</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <a
            href={`${BACKEND_URL}/oauth2/authorization/google`}
            className="w-full flex items-center justify-center gap-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.71-1.57 2.68-3.88 2.68-6.64z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.97H.96C.35 6.17 0 7.55 0 9s.35 2.83.96 4.03l3.01-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            Continuer avec Google
          </a>

          <p className="text-center text-neutral-500 text-xs mt-4">
            Pas de compte ?{" "}
            <a
              href="/register"
              className="text-primary-600 hover:underline font-medium"
            >
              S inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
