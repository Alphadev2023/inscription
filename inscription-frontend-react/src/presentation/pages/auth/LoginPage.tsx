import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FileText, Mail, Lock } from "lucide-react"
import { useLogin } from "@/application/hooks/auth/useAuth"

const schema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const login = useLogin()

  const onSubmit = (data: FormData) => login.mutate(data)

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
          <p className="text-neutral-500 text-sm mb-6">Accedez a votre espace</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.email && <p className="text-danger-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  {...register("motDePasse")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.motDePasse && <p className="text-danger-500 text-xs mt-1">{errors.motDePasse.message}</p>}
            </div>

            {login.isError && (
              <p className="text-danger-500 text-sm text-center">Email ou mot de passe incorrect</p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {login.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-xs mt-4">
            Pas de compte ?{" "}
            <a href="/register" className="text-primary-600 hover:underline font-medium">
              S inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
