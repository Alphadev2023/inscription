import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDossier,
  useValiderDossier,
  useRejeterDossier,
} from "@/application/hooks/dossiers/useDossiers";
import {
  useValiderDocument,
  useRejeterDocument,
} from "@/application/hooks/documents/useDocuments";
import Spinner from "@/presentation/components/ui/Spinner";
import Badge from "@/presentation/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Download,
} from "lucide-react";
import { StatutDossier, StatutValidation } from "@/domain/enums";

export default function AgentDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dossier, isLoading } = useDossier(id ?? "");
  const validerDossier = useValiderDossier();
  const rejeterDossier = useRejeterDossier();
  const validerDoc = useValiderDocument();
  const rejeterDoc = useRejeterDocument();
  const [raisonRejet, setRaisonRejet] = useState("");
  const [showRejetModal, setShowRejetModal] = useState(false);
  const [rejetDocId, setRejetDocId] = useState<string | null>(null);
  const [raisonRejetDoc, setRaisonRejetDoc] = useState("");

  if (isLoading) return <Spinner />;
  if (!dossier)
    return (
      <p className="text-neutral-500 text-center py-12">Dossier introuvable</p>
    );

  const canValider =
    dossier.statut === StatutDossier.SOUMIS ||
    dossier.statut === StatutDossier.EN_COURS;
  const candidat = dossier.candidat;
  const etapeAff = ["SOUMIS", "EN_COURS", "VALIDE", "REJETE"].includes(
    dossier.statut,
  )
    ? 5
    : dossier.etapeActuelle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/agent/dossiers")}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} className="text-neutral-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          {candidat && (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
              {candidat.nom.charAt(0)}
              {candidat.prenom.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {candidat ? `${candidat.nom} ${candidat.prenom}` : "Dossier"}
            </h1>
            <p className="text-neutral-500 text-sm">Detail du dossier</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge statut={dossier.statut} />
          <span className="text-sm text-neutral-400">
            Completion : {dossier.scoreCompletude}%
          </span>
          {canValider && (
            <>
              <button
                onClick={() =>
                  validerDossier.mutate(dossier.id, {
                    onSuccess: () => navigate("/agent/dossiers"),
                  })
                }
                disabled={validerDossier.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-success-500 hover:bg-success-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle size={14} /> Valider
              </button>
              <button
                onClick={() => setShowRejetModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-danger-500 hover:bg-danger-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle size={14} /> Rejeter
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Informations generales */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">
            Informations generales
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "ID Dossier", value: dossier.id },
              { label: "Etape actuelle", value: `${etapeAff}/5` },
              {
                label: "Cree le",
                value: new Date(dossier.creeLe).toLocaleString("fr-FR"),
              },
              {
                label: "Soumis le",
                value: dossier.soumisLe
                  ? new Date(dossier.soumisLe).toLocaleString("fr-FR")
                  : "-",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-neutral-400">{label}</span>
                <span className="font-medium text-neutral-900 truncate max-w-48 text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">
            Completion du dossier
          </h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-neutral-100 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all"
                style={{ width: `${dossier.scoreCompletude}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-primary-600">
              {dossier.scoreCompletude}%
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Etape {etapeAff} sur 5 completee
          </p>
          {dossier.statut === StatutDossier.REJETE && dossier.raisonRejet && (
            <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-danger-600 text-xs font-medium">
                Raison du rejet
              </p>
              <p className="text-danger-700 text-xs mt-1">
                {dossier.raisonRejet}
              </p>
            </div>
          )}
          {dossier.statut === StatutDossier.VALIDE && (
            <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2">
              <CheckCircle size={14} className="text-success-500" />
              <p className="text-success-600 text-xs font-medium">
                Dossier valide
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Infos candidat */}
      {candidat && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <User size={16} /> Informations du candidat
          </h2>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {[
              { label: "Nom", value: candidat.nom },
              { label: "Prenom", value: candidat.prenom },
              { label: "Naissance", value: candidat.dateNaissance },
              { label: "Nationalite", value: candidat.nationalite },
              { label: "Sexe", value: candidat.sexe },
              { label: "Telephone", value: candidat.telephone },
              { label: "Adresse", value: candidat.adresse },
              { label: "Piece", value: candidat.typePiece },
            ].map(({ label, value }) =>
              value ? (
                <div key={label}>
                  <p className="text-neutral-400 text-xs">{label}</p>
                  <p className="font-medium text-neutral-900">{value}</p>
                </div>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Documents */}
      {dossier.documents && dossier.documents.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">
            Documents soumis{" "}
            <span className="text-neutral-400 font-normal">
              {dossier.documents.length}
            </span>
          </h2>
          <div className="space-y-2">
            {dossier.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-neutral-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {doc.type.replace(/_/g, " ")}
                    </p>
                    {doc.nomFichierOriginal && (
                      <p className="text-xs text-primary-500">
                        {doc.nomFichierOriginal}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `/api/documents/${doc.id}/telecharger`,
                        { headers: { Authorization: `Bearer ${token}` } },
                      );
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}
                    className="flex items-center gap-1 px-3 py-1 border border-neutral-200 rounded text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Download size={12} /> Voir
                  </button>
                  <Badge statut={doc.statut} />
                  {doc.statut === StatutValidation.EN_ATTENTE && (
                    <>
                      <button
                        onClick={() => validerDoc.mutate(doc.id)}
                        disabled={validerDoc.isPending}
                        className="flex items-center gap-1 px-3 py-1 bg-success-500 hover:bg-success-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        <CheckCircle size={12} /> Valider
                      </button>
                      <button
                        onClick={() => setRejetDocId(doc.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-danger-500 hover:bg-danger-600 text-white rounded text-xs font-medium transition-colors"
                      >
                        <XCircle size={12} /> Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal rejet dossier */}
      {showRejetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Rejeter le dossier
            </h3>
            <textarea
              value={raisonRejet}
              onChange={(e) => setRaisonRejet(e.target.value)}
              rows={4}
              placeholder="Raison du rejet..."
              className="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowRejetModal(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  rejeterDossier.mutate(
                    { id: dossier.id, raison: raisonRejet },
                    {
                      onSuccess: () => {
                        setShowRejetModal(false);
                        navigate("/agent/dossiers");
                      },
                    },
                  )
                }
                disabled={rejeterDossier.isPending || !raisonRejet.trim()}
                className="flex-1 px-4 py-2 bg-danger-500 hover:bg-danger-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {rejeterDossier.isPending ? "Rejet..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rejet document */}
      {rejetDocId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Rejeter le document
            </h3>
            <textarea
              value={raisonRejetDoc}
              onChange={(e) => setRaisonRejetDoc(e.target.value)}
              rows={3}
              placeholder="Raison du rejet..."
              className="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-danger-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejetDocId(null);
                  setRaisonRejetDoc("");
                }}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  rejeterDoc.mutate(
                    { id: rejetDocId, raison: raisonRejetDoc },
                    {
                      onSuccess: () => {
                        setRejetDocId(null);
                        setRaisonRejetDoc("");
                      },
                    },
                  )
                }
                disabled={rejeterDoc.isPending || !raisonRejetDoc.trim()}
                className="flex-1 px-4 py-2 bg-danger-500 hover:bg-danger-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {rejeterDoc.isPending ? "Rejet..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
