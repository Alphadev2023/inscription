import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { useMonDossier, useCreerDossier, useSoumettreDossier } from "@/application/hooks/dossiers/useDossiers"
import { useUploadDocument } from "@/application/hooks/documents/useDocuments"
import Spinner from "@/presentation/components/ui/Spinner"
import { CheckCircle, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { TypeDocument } from "@/domain/enums"

const schemaEtape1 = z.object({
  nom:           z.string().min(1, "Nom requis"),
  prenom:        z.string().min(1, "Prenom requis"),
  dateNaissance: z.string().min(1, "Date de naissance requise"),
  nationalite:   z.string().min(1, "Nationalite requise"),
  telephone:     z.string().min(1, "Telephone requis"),
  sexe:          z.string().min(1, "Sexe requis"),
  typePiece:     z.string().min(1, "Type de piece requis"),
})
type Etape1Data = z.infer<typeof schemaEtape1>

const schemaEtape3 = z.object({
  dernierEtablissement: z.string().optional(),
  specialisation:       z.string().optional(),
  periodeFormation:     z.string().optional(),
})
type Etape3Data = z.infer<typeof schemaEtape3>

const ETAPES_LABELS = [
  { num: 1, label: "Informations",  desc: "Donnees personnelles" },
  { num: 2, label: "Documents",     desc: "Pieces justificatives" },
  { num: 3, label: "Parcours",      desc: "Academique" },
  { num: 4, label: "Coordonnees",   desc: "Contact" },
  { num: 5, label: "Recapitulatif", desc: "Validation" },
]

const DOCUMENTS_REQUIS = [
  { type: TypeDocument.DIPLOME_BAC,       label: "Diplome du Baccalaureat",  accept: ".pdf,.jpg,.jpeg,.png" },
  { type: TypeDocument.DIPLOME_SUPERIEUR, label: "Diplome Superieur",        accept: ".pdf" },
  { type: TypeDocument.CNI_RECTO,         label: "CNI Recto",                accept: ".jpg,.jpeg,.png" },
  { type: TypeDocument.CNI_VERSO,         label: "CNI Verso",                accept: ".jpg,.jpeg,.png" },
  { type: TypeDocument.ACTE_NAISSANCE,    label: "Acte de naissance",        accept: ".pdf,.jpg,.jpeg,.png" },
  { type: TypeDocument.PHOTO_IDENTITE,    label: "Photo identite",           accept: ".jpg,.jpeg,.png" },
]

export default function CandidatInscription() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState(1)
  const { data: dossier, isLoading } = useMonDossier()
  const creer = useCreerDossier()
  const soumettre = useSoumettreDossier()
  const uploadDoc = useUploadDocument()
  const [uploadedTypes, setUploadedTypes] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<string | null>(null)
  const qc = useQueryClient()

  const form1 = useForm<Etape1Data>({ resolver: zodResolver(schemaEtape1) })
  const form3 = useForm<Etape3Data>({ resolver: zodResolver(schemaEtape3) })

  if (isLoading) return <Spinner />

  const dossierId = dossier?.id

  const handleEtape1 = form1.handleSubmit(async (data) => {
    if (!dossierId) await creer.mutateAsync(data)
    setEtape(2)
  })

  const handleEtape3 = form3.handleSubmit(async (data) => {
    if (dossierId) await soumettre.mutateAsync({ id: dossierId, data })
    setEtape(4)
  })

  const handleUpload = async (type: TypeDocument, file: File) => {
    if (!dossierId) return
    setUploading(type)
    try {
      await uploadDoc.mutateAsync({ dossierId, type, file })
      setUploadedTypes((prev) => new Set([...prev, type]))
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Formulaire inscription</h1>
        <p className="text-neutral-500 text-sm">Completez toutes les etapes pour soumettre votre dossier</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          {ETAPES_LABELS.map(({ num, label, desc }, i) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  etape === num ? "bg-primary-600 text-white" :
                  etape > num  ? "bg-success-500 text-white" :
                  "bg-neutral-200 text-neutral-400"
                }`}>
                  {etape > num ? <CheckCircle size={16} /> : num}
                </div>
                <p className={`text-xs font-medium mt-1 ${etape === num ? "text-primary-600" : "text-neutral-400"}`}>{label}</p>
                <p className="text-xs text-neutral-300">{desc}</p>
              </div>
              {i < ETAPES_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-6 ${etape > num ? "bg-success-400" : "bg-neutral-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">

        {etape === 1 && (
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nom *</label>
                <input {...form1.register("nom")} defaultValue={dossier?.candidat?.nom}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Dupont" />
                {form1.formState.errors.nom && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.nom.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Prenom *</label>
                <input {...form1.register("prenom")} defaultValue={dossier?.candidat?.prenom}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Jean" />
                {form1.formState.errors.prenom && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.prenom.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date de naissance *</label>
                <input {...form1.register("dateNaissance")} type="date"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {form1.formState.errors.dateNaissance && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.dateNaissance.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nationalite *</label>
                <input {...form1.register("nationalite")}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Guineenne" />
                {form1.formState.errors.nationalite && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.nationalite.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Telephone *</label>
                <input {...form1.register("telephone")} defaultValue={dossier?.candidat?.telephone}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+224 620 000 000" />
                {form1.formState.errors.telephone && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.telephone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Sexe *</label>
                <select {...form1.register("sexe")} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Selectionner...</option>
                  <option value="MASCULIN">Masculin</option>
                  <option value="FEMININ">Feminin</option>
                </select>
                {form1.formState.errors.sexe && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.sexe.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Type piece identite *</label>
                <select {...form1.register("typePiece")} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Selectionner...</option>
                  <option value="CNI">Carte nationale</option>
                  <option value="PASSEPORT">Passeport</option>
                  <option value="ACTE_NAISSANCE">Acte de naissance</option>
                </select>
                {form1.formState.errors.typePiece && <p className="text-danger-500 text-xs mt-1">{form1.formState.errors.typePiece.message}</p>}
              </div>
            </div>
          </div>
        )}

        {etape === 2 && (
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">Documents officiels</h2>
            <div className="space-y-3">
              {DOCUMENTS_REQUIS.map(({ type, label, accept }) => {
                const docExist = dossier?.documents?.find((d) => d.type === type) ?? (uploadedTypes.has(type) ? { nomFichierOriginal: "Document uploade" } : null)
                return (
                  <div key={type} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {docExist ? <CheckCircle size={18} className="text-success-500" /> : <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />}
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{label}</p>
                        {docExist?.nomFichierOriginal && <p className="text-xs text-neutral-400">{docExist.nomFichierOriginal}</p>}
                      </div>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer px-3 py-1.5 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors">
                      {uploading === type ? "..." : <><Upload size={12} />{docExist ? "Remplacer" : "Choisir"}</>}
                      <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(type, f) }} />
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {etape === 3 && (
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">Parcours academique</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Dernier etablissement</label>
                <input {...form3.register("dernierEtablissement")} defaultValue={dossier?.dernierEtablissement}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Universite de Conakry" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Specialisation</label>
                <input {...form3.register("specialisation")} defaultValue={dossier?.specialisation}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Informatique" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Periode de formation</label>
                <input {...form3.register("periodeFormation")} defaultValue={dossier?.periodeFormation}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="2020 - 2024" />
              </div>
            </div>
          </div>
        )}

        {etape === 4 && (
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">Coordonnees</h2>
            <p className="text-neutral-500 text-sm">Vos coordonnees sont issues de votre compte.</p>
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">Email enregistre lors de la creation du compte.</p>
            </div>
          </div>
        )}

        {etape === 5 && (
          <div>
            <h2 className="font-semibold text-neutral-900 mb-4">Recapitulatif</h2>
            {dossier?.candidat && (
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-neutral-50 rounded-lg grid grid-cols-2 gap-3">
                  {[
                    { label: "Nom",        value: dossier.candidat.nom },
                    { label: "Prenom",     value: dossier.candidat.prenom },
                    { label: "Naissance",  value: dossier.candidat.dateNaissance },
                    { label: "Nationalite",value: dossier.candidat.nationalite },
                    { label: "Telephone",  value: dossier.candidat.telephone },
                    { label: "Sexe",       value: dossier.candidat.sexe },
                  ].map(({ label, value }) => value ? (
                    <div key={label}><p className="text-neutral-400 text-xs">{label}</p><p className="font-medium text-neutral-900">{value}</p></div>
                  ) : null)}
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-400 text-xs mb-2">Documents ({dossier.documents?.length ?? 0}/6)</p>
                  <div className="flex flex-wrap gap-2">
                    {dossier.documents?.map((doc) => (
                      <span key={doc.id} className="text-xs bg-success-100 text-success-600 px-2 py-1 rounded">{doc.type.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-primary-700 text-sm">En soumettant votre dossier, vous confirmez que toutes les informations sont exactes.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
          <button onClick={() => setEtape((e) => Math.max(1, e - 1))} disabled={etape === 1}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 transition-colors">
            Precedent
          </button>
          <span className="text-xs text-neutral-400">Etape {etape} sur 5</span>
          {etape < 5 ? (
            <button onClick={() => { if (etape === 1) handleEtape1(); else if (etape === 3) handleEtape3(); else setEtape((e) => e + 1) }}
              disabled={creer.isPending || soumettre.isPending}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
              Suivant
            </button>
          ) : (
            <button onClick={() => navigate("/candidat/dashboard")}
              className="px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <CheckCircle size={14} /> Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
