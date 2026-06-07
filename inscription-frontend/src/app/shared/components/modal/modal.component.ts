import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="closed.emit()"
        ></div>
        <div
          class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col"
          style="max-height: 90vh"
        >
          <div
            class="flex items-center justify-between p-6 border-b border-neutral-100"
          >
            <h3 class="text-lg font-semibold text-neutral-900">
              {{ title() }}
            </h3>
            <button
              (click)="closed.emit()"
              class="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <app-icon name="x" [size]="20" />
            </button>
          </div>
          <div class="overflow-y-auto flex-1 p-6">
            <ng-content />
          </div>
          @if (hasFooter()) {
            <div class="p-6 border-t border-neutral-100">
              <ng-content select="[slot=footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input<string>('');
  hasFooter = input<boolean>(false);
  closed = output<void>();
}
