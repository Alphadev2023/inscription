import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Role } from "@/domain/enums";
import ProtectedRoute from "@/presentation/routes/ProtectedRoute";
import MainLayout from "@/presentation/components/layout/MainLayout";

import LoginPage from "@/presentation/pages/auth/LoginPage";
import RegisterPage from "@/presentation/pages/auth/RegisterPage";
import UnauthorizedPage from "@/presentation/pages/auth/UnauthorizedPage";
import OAuth2RedirectPage from "@/presentation/pages/auth/OAuth2RedirectPage";

import AdminDashboard from "@/presentation/pages/admin/AdminDashboard";
import AdminDossiers from "@/presentation/pages/admin/AdminDossiers";
import AdminDossierDetail from "@/presentation/pages/admin/AdminDossierDetail";
import AdminAgents from "@/presentation/pages/admin/AdminAgents";
import AdminStats from "@/presentation/pages/admin/AdminStats";

import AgentDashboard from "@/presentation/pages/agent/AgentDashboard";

import CandidatDashboard from "@/presentation/pages/candidat/CandidatDashboard";
import CandidatInscription from "@/presentation/pages/candidat/CandidatInscription";
import CandidatDossier from "@/presentation/pages/candidat/CandidatDossier";

import { PaiementSuccesPage } from "@/presentation/pages/paiement/PaiementSuccesPage";
import { PaiementAnnulePage } from "@/presentation/pages/paiement/PaiementAnnulePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dossiers" element={<AdminDossiers />} />
          <Route path="/admin/dossiers/:id" element={<AdminDossierDetail />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Route>

        {/* Agent */}
        <Route
          element={
            <ProtectedRoute roles={[Role.AGENT, Role.ADMIN]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
        </Route>

        {/* Candidat */}
        <Route
          element={
            <ProtectedRoute roles={[Role.CANDIDAT]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/candidat/dashboard" element={<CandidatDashboard />} />
          <Route
            path="/candidat/inscription"
            element={<CandidatInscription />}
          />
          <Route path="/candidat/dossier" element={<CandidatDossier />} />
          <Route path="/paiement/succes" element={<PaiementSuccesPage />} />
          <Route path="/paiement/annule" element={<PaiementAnnulePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
