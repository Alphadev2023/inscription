import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface Step {
  label: string;
  description?: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="w-full">
      <div class="flex items-center">
        @for (step of steps(); track $index) {
          <div
            class="flex items-center"
            [class.flex-1]="$index < steps().length - 1"
          >
            <div class="flex flex-col items-center">
              <div [class]="circleClass($index)">
                @if ($index < currentStep()) {
                  <app-icon name="check" [size]="16" />
                } @else {
                  <span class="text-xs font-bold">{{ $index + 1 }}</span>
                }
              </div>
              <div class="mt-2 text-center hidden sm:block">
                <p [class]="labelClass($index)">{{ step.label }}</p>
                @if (step.description) {
                  <p class="text-xs text-neutral-400 mt-0.5">
                    {{ step.description }}
                  </p>
                }
              </div>
            </div>
            @if ($index < steps().length - 1) {
              <div
                class="flex-1 h-0.5 mx-3 mb-6"
                [class]="
                  $index < currentStep() ? 'bg-primary-500' : 'bg-neutral-200'
                "
              ></div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class StepperComponent {
  steps = input.required<Step[]>();
  currentStep = input.required<number>();

  circleClass(index: number): string {
    const base =
      'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300';
    if (index < this.currentStep()) return `${base} bg-primary-600 text-white`;
    if (index === this.currentStep())
      return `${base} bg-primary-600 text-white ring-4 ring-primary-100`;
    return `${base} bg-neutral-100 text-neutral-400`;
  }

  labelClass(index: number): string {
    if (index <= this.currentStep())
      return 'text-xs font-medium text-primary-600';
    return 'text-xs font-medium text-neutral-400';
  }
}
