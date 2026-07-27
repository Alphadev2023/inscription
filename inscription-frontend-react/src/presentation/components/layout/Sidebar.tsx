import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  FileText,
  Bell,
  LogOut,
  ClipboardList,
  X,
} from "lucide-react";
import { useAuthStore } from "@/infrastructure/store/authStore";
import { useLogout } from "@/application/hooks/auth/useAuth";
import { Role } from "@/domain/enums";
import { useNotifications } from "@/application/hooks/notifications/useNotifications";

const adminLinks = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/dossiers", label: "Dossiers", icon: FolderOpen },
  { to: "/admin/agents", label: "Agents", icon: Users },
  { to: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

const agentLinks = [
  { to: "/agent/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/agent/dossiers", label: "Dossiers", icon: FolderOpen },
];

const candidatLinks = [
  {
    to: "/candidat/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    to: "/candidat/inscription",
    label: "Mon inscription",
    icon: ClipboardList,
  },
  { to: "/candidat/dossier", label: "Mon dossier", icon: FileText },
];

export default function Sidebar() {
  const { email, role } = useAuthStore();
  const logout = useLogout();
  const { notifications, unreadCount, markAllRead, clear } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);

  const links =
    role === Role.ADMIN
      ? adminLinks
      : role === Role.AGENT
        ? agentLinks
        : candidatLinks;

  const roleLabel =
    role === Role.ADMIN
      ? "Administration"
      : role === Role.AGENT
        ? "Espace Agent"
        : "Espace Candidat";

  const initiale = email?.charAt(0).toUpperCase() ?? "?";

  const handleBell = () => {
    setShowNotifs((v) => !v);
    if (!showNotifs) markAllRead();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-44 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">
              Inscription
            </p>
            <p className="text-neutral-400 text-xs">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-neutral-500 text-xs font-semibold uppercase px-2 mb-2">
          Principal
        </p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-neutral-700">
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
            {initiale}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs truncate">{email}</p>
            <p className="text-neutral-400 text-xs">{role}</p>
          </div>
          <div className="relative">
            <button
              onClick={handleBell}
              className="relative p-1 hover:bg-neutral-800 rounded transition-colors"
            >
              <Bell size={14} className="text-neutral-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 rounded-full text-white text-xs flex items-center justify-center leading-none font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown notifications */}
            {showNotifs && (
              <div className="fixed bottom-16 left-44 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-semibold text-neutral-900">
                    Notifications
                  </p>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={clear}
                        className="text-xs text-neutral-400 hover:text-neutral-600"
                      >
                        Tout effacer
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-neutral-400 text-sm text-center py-6">
                      Aucune notification
                    </p>
                  ) : (
                    notifications.map((n, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                      >
                        <p className="text-sm text-neutral-900">{n.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {new Date(n.timestamp ?? "").toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg text-sm transition-colors"
        >
          <LogOut size={14} />
          <span>Deconnexion</span>
        </button>
      </div>
    </aside>
  );
}
