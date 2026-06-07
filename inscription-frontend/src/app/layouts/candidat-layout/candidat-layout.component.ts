import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { WebsocketService } from '../../core/services/websocket.service';
import { NotificationBellComponent } from '../../shared/components/notification-bell/notification-bell.component';

@Component({
  selector: 'app-candidat-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    NotificationBellComponent,
  ],
  template: `
    <div class="min-h-screen bg-neutral-50 flex">
      <!-- Sidebar Desktop -->
      <aside
        class="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200 fixed inset-y-0"
      >
        <!-- Sidebar Desktop — cloche ici -->
        <div
          class="flex items-center gap-3 px-6 py-5 border-b border-neutral-100"
        >
          <div
            class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">I</span>
          </div>
          <div class="flex-1">
            <p class="font-bold text-neutral-900 text-sm">Inscription</p>
            <p class="text-xs text-neutral-500">Espace Candidat</p>
          </div>
          <app-notification-bell />
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
          <a
            routerLink="/candidat/dashboard"
            routerLinkActive="bg-primary-50 text-primary-700"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <app-icon name="home" [size]="18" />
            Tableau de bord
          </a>
          <a
            routerLink="/candidat/inscription"
            routerLinkActive="bg-primary-50 text-primary-700"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <app-icon name="upload" [size]="18" />
            Mon inscription
          </a>
          <a
            routerLink="/candidat/mon-dossier"
            routerLinkActive="bg-primary-50 text-primary-700"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <app-icon name="file-text" [size]="18" />
            Mon dossier
          </a>
        </nav>

        <div class="px-3 py-4 border-t border-neutral-100">
          <div class="flex items-center gap-3 px-3 py-2">
            <div
              class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <app-icon name="user" [size]="16" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-neutral-900 truncate">
                {{ auth.user()?.email }}
              </p>
              <p class="text-xs text-neutral-500">Candidat</p>
            </div>
          </div>
          <button
            (click)="auth.logout()"
            class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors mt-1"
          >
            <app-icon name="log-out" [size]="18" />
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Mobile Header -->
      <!-- Mobile Header — cloche ici aussi mais lg:hidden -->
      <div
        class="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-neutral-200"
      >
        <div class="flex items-center justify-between px-4 h-14">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-xs">I</span>
            </div>
            <span class="font-bold text-neutral-900 text-sm">Inscription</span>
          </div>
          <div class="flex items-center gap-2">
            <app-notification-bell />
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              @if (mobileMenuOpen()) {
                <app-icon name="x" [size]="20" />
              } @else {
                <app-icon name="menu" [size]="20" />
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div
          class="lg:hidden fixed inset-0 z-20 bg-black/50"
          (click)="mobileMenuOpen.set(false)"
        ></div>
        <div
          class="lg:hidden fixed top-14 inset-x-0 z-20 bg-white border-b border-neutral-200 p-4 space-y-1"
        >
          <a
            routerLink="/candidat/dashboard"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <app-icon name="home" [size]="18" /> Tableau de bord
          </a>
          <a
            routerLink="/candidat/inscription"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <app-icon name="upload" [size]="18" /> Mon inscription
          </a>
          <a
            routerLink="/candidat/mon-dossier"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            <app-icon name="file-text" [size]="18" /> Mon dossier
          </a>
          <button
            (click)="auth.logout()"
            class="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50"
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
export class CandidatLayoutComponent {
  auth = inject(AuthService);
  mobileMenuOpen = signal(false);

  ws = inject(WebsocketService);

  ngOnInit() {
    this.ws.connecter();
  }

  ngOnDestroy() {
    this.ws.deconnecter();
  }
}
