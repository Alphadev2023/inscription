import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="alertClass()" role="alert">
      <div class="flex items-start gap-3">
        <app-icon
          [name]="iconName()"
          [size]="18"
          class="mt-0.5 flex-shrink-0"
        />
        <div class="flex-1">
          @if (title()) {
            <p class="font-medium text-sm">{{ title() }}</p>
          }
          <p class="text-sm" [class.mt-1]="title()">{{ message() }}</p>
        </div>
        @if (dismissible()) {
          <button
            (click)="dismissed.emit()"
            class="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <app-icon name="x" [size]="16" />
          </button>
        }
      </div>
    </div>
  `,
})
export class AlertComponent {
  type = input<AlertType>('info');
  title = input<string>('');
  message = input<string>('');
  dismissible = input<boolean>(false);
  dismissed = output<void>();

  alertClass(): string {
    const base = 'rounded-lg p-4 border';
    const styles: Record<AlertType, string> = {
      success: `${base} bg-success-50 border-success-200 text-success-700`,
      error: `${base} bg-danger-50 border-danger-200 text-danger-700`,
      warning: `${base} bg-warning-50 border-warning-200 text-warning-700`,
      info: `${base} bg-primary-50 border-primary-200 text-primary-700`,
    };
    return styles[this.type()];
  }

  iconName(): any {
    const icons: Record<AlertType, string> = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'alert-circle',
    };
    return icons[this.type()];
  }
}
