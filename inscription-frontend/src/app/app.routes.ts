import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then(
            (m) => m.LandingComponent,
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
    ],
  },
  {
    path: 'candidat',
    loadComponent: () =>
      import('./layouts/candidat-layout/candidat-layout.component').then(
        (m) => m.CandidatLayoutComponent,
      ),
    canActivate: [authGuard, roleGuard('CANDIDAT')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/candidat/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./features/candidat/inscription/inscription.component').then(
            (m) => m.InscriptionComponent,
          ),
      },
      {
        path: 'mon-dossier',
        loadComponent: () =>
          import('./features/candidat/mon-dossier/mon-dossier.component').then(
            (m) => m.MonDossierComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    canActivate: [authGuard, roleGuard('ADMIN', 'AGENT')],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'dossiers',
        loadComponent: () =>
          import('./features/admin/dossiers/dossiers.component').then(
            (m) => m.DossiersComponent,
          ),
      },
      {
        path: 'dossiers/:id',
        loadComponent: () =>
          import('./features/admin/dossiers/detail/dossier-detail.component').then(
            (m) => m.DossierDetailComponent,
          ),
      },

      {
        path: 'agents',
        loadComponent: () =>
          import('./features/admin/agents/agents.component').then(
            (m) => m.AgentsComponent,
          ),
      },
      {
        path: 'statistiques',
        loadComponent: () =>
          import('./features/admin/statistiques/statistiques.component').then(
            (m) => m.StatistiquesComponent,
          ),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  { path: '**', redirectTo: '404' },
];
