import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent, IconName } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, IconComponent],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="buttonClass()"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <app-spinner size="sm" />
      } @else if (icon()) {
        <app-icon [name]="icon()!" [size]="16" />
      }
      <span>{{ label() }}</span>
    </button>
  `,
})
export class ButtonComponent {
  label = input.required<string>();
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  icon = input<IconName | undefined>(undefined);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
  clicked = output<void>();

  buttonClass(): string {
    const base =
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
    const fw = this.fullWidth() ? ' w-full' : '';
    const variants: Record<ButtonVariant, string> = {
      primary: `${base}${fw} bg-primary-600 text-white hover:bg-primary-700`,
      secondary: `${base}${fw} bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50`,
      danger: `${base}${fw} bg-danger-500 text-white hover:bg-danger-700`,
      ghost: `${base}${fw} text-neutral-600 hover:bg-neutral-100`,
    };
    return variants[this.variant()];
  }
}
