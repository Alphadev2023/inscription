import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div
      class="flex items-center justify-center"
      [class]="fullPage() ? 'min-h-screen' : ''"
    >
      <div
        class="animate-spin rounded-full border-2 border-neutral-200"
        [class]="sizeClass()"
        style="border-top-color: #2563eb"
      ></div>
      @if (label()) {
        <span class="ml-3 text-sm text-neutral-600">{{ label() }}</span>
      }
    </div>
  `,
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('');
  fullPage = input<boolean>(false);

  sizeClass(): string {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return sizes[this.size()];
  }
}
