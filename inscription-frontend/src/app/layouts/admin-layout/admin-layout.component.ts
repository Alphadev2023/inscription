import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
  ],
  template: `
    <div class="min-h-screen bg-neutral-50 flex">
      <!-- Sidebar Desktop -->
      <aside
        class="hidden lg:flex flex-col w-64 bg-neutral-900 fixed inset-y-0"
      >
        <div
          class="flex items-center gap-3 px-6 py-5 border-b border-neutral-800"
        >
          <div
            class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"
          >
            <app-icon name="shield" [size]="16" />
          </div>
          <div>
            <p class="font-bold text-white text-sm">Inscription</p>
            <p class="text-xs text-neutral-400">Administration</p>
          </div>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
          <p
            class="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider"
          >
            Principal
          </p>
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="bg-neutral-800 text-white"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <app-icon name="home" [size]="18" /> Tableau de bord
          </a>
          <a
            routerLink="/admin/dossiers"
            routerLinkActive="bg-neutral-800 text-white"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <app-icon name="file-text" [size]="18" /> Dossiers
          </a>
          <a
            routerLink="/admin/agents"
            routerLinkActive="bg-neutral-800 text-white"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <app-icon name="users" [size]="18" /> Agents
          </a>

          <p
            class="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-4"
          >
            Analytique
          </p>
          <a
            routerLink="/admin/stats"
            routerLinkActive="bg-neutral-800 text-white"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <app-icon name="bar-chart-2" [size]="18" /> Statistiques
          </a>
        </nav>

        <div class="px-3 py-4 border-t border-neutral-800">
          <div class="flex items-center gap-3 px-3 py-2">
            <div
              class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
            >
              <app-icon name="user" [size]="16" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {{ auth.user()?.email }}
              </p>
              <p class="text-xs text-neutral-400">{{ auth.role() }}</p>
            </div>
          </div>
          <button
            (click)="auth.logout()"
            class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-danger-400 transition-colors mt-1"
          >
            <app-icon name="log-out" [size]="18" /> Déconnexion
          </button>
        </div>
      </aside>

      <!-- Mobile Header -->
      <div
        class="lg:hidden fixed top-0 inset-x-0 z-30 bg-neutral-900 border-b border-neutral-800"
      >
        <div class="flex items-center justify-between px-4 h-14">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"
            >
              <app-icon name="shield" [size]="14" />
            </div>
            <span class="font-bold text-white text-sm">Administration</span>
          </div>
          <button
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="p-2 text-neutral-400 hover:bg-neutral-800 rounded-lg"
          >
            @if (mobileMenuOpen()) {
              <app-icon name="x" [size]="20" />
            } @else {
              <app-icon name="menu" [size]="20" />
            }
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div
          class="lg:hidden fixed inset-0 z-20 bg-black/50"
          (click)="mobileMenuOpen.set(false)"
        ></div>
        <div
          class="lg:hidden fixed top-14 inset-x-0 z-20 bg-neutral-900 border-b border-neutral-800 p-4 space-y-1"
        >
          <a
            routerLink="/admin/dashboard"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <app-icon name="home" [size]="18" /> Tableau de bord
          </a>
          <a
            routerLink="/admin/dossiers"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <app-icon name="file-text" [size]="18" /> Dossiers
          </a>
          <a
            routerLink="/admin/agents"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <app-icon name="users" [size]="18" /> Agents
          </a>
          <button
            (click)="auth.logout()"
            class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-danger-400"
          >
            <app-icon name="log-out" [size]="18" /> Déconnexion
          </button>
        </div>
      }

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div class="p-6">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  mobileMenuOpen = signal(false);
}
