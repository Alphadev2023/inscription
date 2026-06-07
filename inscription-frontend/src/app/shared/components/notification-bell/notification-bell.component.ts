import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../core/services/websocket.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './notification-bell.component.html',
})
export class NotificationBellComponent {
  ws = inject(WebsocketService);
  ouvert = signal(false);

  @HostListener('document:click', ['$event'])
  onClickExterieur(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('.notification-bell')) {
      this.ouvert.set(false);
    }
  }

  toggle() {
    this.ouvert.set(!this.ouvert());
  }

  getTypeClass(type: string): string {
    const classes: Record<string, string> = {
      SUCCES: 'bg-success-50 text-success-700 border-success-200',
      ERREUR: 'bg-danger-50 text-danger-700 border-danger-200',
      INFO: 'bg-blue-50 text-blue-700 border-blue-200',
      AVERTISSEMENT: 'bg-warning-50 text-warning-700 border-warning-200',
    };
    return classes[type] ?? 'bg-neutral-50 text-neutral-700 border-neutral-200';
  }

  getTypeIcon(type: string): any {
    const icons: Record<string, string> = {
      SUCCES: 'check-circle',
      ERREUR: 'x-circle',
      INFO: 'alert-circle',
      AVERTISSEMENT: 'alert-triangle',
    };
    return icons[type] ?? 'bell';
  }
}
