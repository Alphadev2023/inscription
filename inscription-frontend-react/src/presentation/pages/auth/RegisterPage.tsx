import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FileText, Mail, Lock, User, Shield } from "lucide-react"
import { useRegister } from "@/application/hooks/auth/useAuth"
import { Role } from "@/domain/enums"

const schema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(6, "Minimum 6 caracteres"),
  confirmer: z.string().min(1, "Confirmation requise"),
}).refine((d) => d.motDePasse === d.confirmer, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmer"],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(Role.CANDIDAT)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const registerMutation = useRegister()

  const onSubmit = (data: FormData) => {
    registerMutation.mutate({ email: data.email, motDePasse: data.motDePasse, role })
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white text-xl font-bold">Inscription</p>
            <p className="text-neutral-400 text-xs">Creer un compte</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h1 className="text-xl font-bold text-neutral-900 mb-1">Creer un compte</h1>
          <p className="text-neutral-500 text-sm mb-6">Rejoignez la plateforme</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Adresse email</label>
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Confirmer</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  {...register("confirmer")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {errors.confirmer && <p className="text-danger-500 text-xs mt-1">{errors.confirmer.message}</p>}
            </div>

            {/* Selecteur de role */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Je suis</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(Role.CANDIDAT)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    role === Role.CANDIDAT
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <User size={24} className={role === Role.CANDIDAT ? "text-primary-500" : "text-neutral-400"} />
                  <span className={`text-sm font-medium ${role === Role.CANDIDAT ? "text-primary-600" : "text-neutral-600"}`}>
                    Candidat
                  </span>
                  <span className="text-xs text-neutral-400">Je souhaite m inscrire</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(Role.AGENT)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                    role === Role.AGENT
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Shield size={24} className={role === Role.AGENT ? "text-primary-500" : "text-neutral-400"} />
                  <span className={`text-sm font-medium ${role === Role.AGENT ? "text-primary-600" : "text-neutral-600"}`}>
                    Agent
                  </span>
                  <span className="text-xs text-neutral-400">Je traite les dossiers</span>
                </button>
              </div>
            </div>

            {registerMutation.isError && (
              <p className="text-danger-500 text-sm text-center">Erreur lors de la creation du compte</p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {registerMutation.isPending ? "Creation..." : "Creer mon compte"}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-xs mt-4">
            Deja un compte ?{" "}
            <a href="/login" className="text-primary-600 hover:underline font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
