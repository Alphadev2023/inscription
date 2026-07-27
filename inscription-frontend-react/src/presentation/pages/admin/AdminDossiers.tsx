import { useState } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDossiers } from "@/application/hooks/dossiers/useDossiers";
import { useQueryClient } from "@tanstack/react-query";
import Badge from "@/presentation/components/ui/Badge";
import Spinner from "@/presentation/components/ui/Spinner";
import { StatutDossier } from "@/domain/enums";
import { useNavigate } from "react-router-dom";
import { DOSSIER_KEYS } from "@/application/hooks/dossiers/useDossiers";

const FILTRES = [
  "Tous",
  "Soumis",
  "En cours",
  "Validés",
  "Rejetés",
  "Brouillon",
] as const;
type Filtre = (typeof FILTRES)[number];

const filtreToStatut: Record<Filtre, StatutDossier | null> = {
  Tous: null,
  Soumis: StatutDossier.SOUMIS,
  "En cours": StatutDossier.EN_COURS,
  Validés: StatutDossier.VALIDE,
  Rejetés: StatutDossier.REJETE,
  Brouillon: StatutDossier.BROUILLON,
};

const PAR_PAGE = 10;

export default function AdminDossiers() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: dossiers, isLoading } = useDossiers();
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<Filtre>("Tous");
  const [page, setPage] = useState(1);
  const [prevFiltreKey, setPrevFiltreKey] = useState(`${search}|${filtre}`);

  const filtered =
    dossiers?.filter((d) => {
      const matchSearch =
        d.nomCandidat.toLowerCase().includes(search.toLowerCase()) ||
        d.prenomCandidat.toLowerCase().includes(search.toLowerCase());
      const matchFiltre =
        filtreToStatut[filtre] === null || d.statut === filtreToStatut[filtre];
      return matchSearch && matchFiltre;
    }) ?? [];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAR_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const debut = (pageClamped - 1) * PAR_PAGE;
  const pageItems = filtered.slice(debut, debut + PAR_PAGE);

  const filtreKey = `${search}|${filtre}`;
  if (filtreKey !== prevFiltreKey) {
    setPrevFiltreKey(filtreKey);
    setPage(1);
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Dossiers d&apos;inscription
          </h1>
          <p className="text-neutral-500 text-sm">
            {dossiers?.length ?? 0} dossier(s) au total
          </p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: DOSSIER_KEYS.all })}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        {/* Recherche + Filtres */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou prénom..."
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {FILTRES.map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filtre === f
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              {[
                "Candidat",
                "Statut",
                "Complétion",
                "Etape",
                "Date création",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-neutral-500 uppercase pb-3 pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((d) => (
              <tr
                key={d.id}
                className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                      {d.nomCandidat.charAt(0)}
                      {d.prenomCandidat.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      {d.nomCandidat} {d.prenomCandidat}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <Badge statut={d.statut} />
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-neutral-100 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full"
                        style={{ width: `${d.scoreCompletude}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-500">
                      {d.scoreCompletude}%
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-neutral-600">
                  {["SOUMIS", "EN_COURS", "VALIDE", "REJETE"].includes(d.statut)
                    ? "5/5"
                    : `${d.etapeActuelle}/5`}
                </td>
                <td className="py-3 pr-4 text-sm text-neutral-500">
                  {new Date(d.creeLe).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => navigate(`/admin/dossiers/${d.id}`)}
                    className="flex items-center gap-1 text-primary-600 text-sm hover:underline"
                  >
                    <Eye size={14} /> Voir le dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <p className="text-neutral-400 text-sm text-center py-8">
            Aucun dossier trouvé
          </p>
        ) : (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
            <p className="text-neutral-400 text-xs">
              {debut + 1}-{Math.min(debut + PAR_PAGE, filtered.length)} sur{" "}
              {filtered.length} dossier(s)
            </p>
            {totalPages > 1 && (
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
                          ? "bg-primary-600 text-white"
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
