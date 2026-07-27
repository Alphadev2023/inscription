import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossiers } from "@/application/hooks/dossiers/useDossiers";
import Spinner from "@/presentation/components/ui/Spinner";
import Badge from "@/presentation/components/ui/Badge";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { StatutDossier } from "@/domain/enums";

const FILTRES = [
  { label: "Tous", value: "TOUS" },
  { label: "Soumis", value: StatutDossier.SOUMIS },
  { label: "En cours", value: StatutDossier.EN_COURS },
  { label: "Valides", value: StatutDossier.VALIDE },
  { label: "Rejetes", value: StatutDossier.REJETE },
] as const;

const PAR_PAGE = 10;

export default function AgentDossiers() {
  const navigate = useNavigate();
  const { data: dossiers, isLoading } = useDossiers();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<string>("TOUS");
  const [page, setPage] = useState(1);

  const filtres = (dossiers ?? []).filter((d) => {
    const matchStatut = filtre === "TOUS" || d.statut === filtre;
    const nomComplet = `${d.nomCandidat} ${d.prenomCandidat}`.toLowerCase();
    const matchRecherche = nomComplet.includes(recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  const totalPages = Math.max(1, Math.ceil(filtres.length / PAR_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const debut = (pageClamped - 1) * PAR_PAGE;
  const pageItems = filtres.slice(debut, debut + PAR_PAGE);

  // Revenir a la page 1 quand la recherche ou le filtre change
  useEffect(() => {
    setPage(1);
  }, [recherche, filtre]);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mes dossiers</h1>
        <p className="text-neutral-500 text-sm">
          Liste complete des dossiers assignes
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un candidat..."
            className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          {FILTRES.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltre(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtre === f.value
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        {filtres.length === 0 ? (
          <p className="text-neutral-400 text-sm text-center py-8">
            Aucun dossier trouve
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {pageItems.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                      {d.nomCandidat.charAt(0)}
                      {d.prenomCandidat.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {d.nomCandidat} {d.prenomCandidat}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(d.creeLe).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge statut={d.statut} />
                    <button
                      onClick={() => navigate(`/agent/dossiers/${d.id}`)}
                      className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400">
                  {debut + 1}-{Math.min(debut + PAR_PAGE, filtres.length)} sur{" "}
                  {filtres.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pageClamped === 1}
                    className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                          n === pageClamped
                            ? "bg-primary-500 text-white"
                            : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                      >
                        {n}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={pageClamped === totalPages}
                    className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
