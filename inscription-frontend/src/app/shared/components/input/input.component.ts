import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium text-neutral-700">
          {{ label() }}
          @if (required()) {
            <span class="text-danger-500">*</span>
          }
        </label>
      }
      <div class="relative">
        @if (icon()) {
          <div
            class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400"
          >
            <app-icon [name]="icon()!" [size]="16" />
          </div>
        }
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClass()"
        />
      </div>
      @if (error()) {
        <p class="text-xs text-danger-500 flex items-center gap-1">
          <app-icon name="alert-circle" [size]="12" />
          {{ error() }}
        </p>
      }
      @if (hint() && !error()) {
        <p class="text-xs text-neutral-500">{{ hint() }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<IconName | undefined>(undefined);
  error = input<string>('');
  hint = input<string>('');
  required = input<boolean>(false);

  value = '';
  isDisabled = false;
  onChange = (_: any) => {};
  onTouched = () => {};

  inputClass(): string {
    const base = 'input-field';
    const pad = this.icon() ? 'pl-9' : '';
    const err = this.error() ? 'input-error' : '';
    return [base, pad, err].filter(Boolean).join(' ');
  }

  onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  writeValue(val: string) {
    this.value = val ?? '';
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean) {
    this.isDisabled = disabled;
  }
}
