import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { FileSizePipe } from '../../pipes/file-size.pipe';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, IconComponent, FileSizePipe],
  template: `
    <div class="flex flex-col gap-2">
      @if (label()) {
        <label class="text-sm font-medium text-neutral-700">
          {{ label() }}
          @if (required()) {
            <span class="text-danger-500">*</span>
          }
        </label>
      }
      @if (!selectedFile()) {
        <div
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (dragleave)="isDragging.set(false)"
          (drop)="onDrop($event)"
          [class]="dropZoneClass()"
        >
          <app-icon name="upload" [size]="32" class="text-neutral-300 mb-2" />
          <p class="text-sm font-medium text-neutral-600">
            Glissez un fichier ou
            <span class="text-primary-600 cursor-pointer">parcourir</span>
          </p>
          <p class="text-xs text-neutral-400 mt-1">
            {{ acceptLabel() }} — max {{ maxSizeMb() }} Mo
          </p>
        </div>
      } @else {
        <div
          class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
        >
          <div
            class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <app-icon name="file-text" [size]="20" class="text-primary-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-neutral-900 truncate">
              {{ selectedFile()!.name }}
            </p>
            <p class="text-xs text-neutral-500">
              {{ selectedFile()!.size | fileSize }}
            </p>
          </div>
          <button
            (click)="supprimerFichier()"
            class="text-neutral-400 hover:text-danger-500 transition-colors"
          >
            <app-icon name="x" [size]="18" />
          </button>
        </div>
      }
      <input
        #fileInput
        type="file"
        [accept]="accept()"
        class="hidden"
        (change)="onFileSelected($event)"
      />
      @if (error()) {
        <p class="text-xs text-danger-500 flex items-center gap-1">
          <app-icon name="alert-circle" [size]="12" />
          {{ error() }}
        </p>
      }
    </div>
  `,
})
export class FileUploadComponent {
  label = input<string>('');
  accept = input<string>('application/pdf,image/jpeg,image/png');
  acceptLabel = input<string>('PDF, JPG, PNG');
  maxSizeMb = input<number>(5);
  required = input<boolean>(false);
  error = input<string>('');

  fileSelected = output<File>();
  fileRemoved = output<void>();
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  dropZoneClass(): string {
    const base =
      'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-150';
    return this.isDragging()
      ? `${base} border-primary-400 bg-primary-50`
      : `${base} border-neutral-300 hover:border-primary-400 hover:bg-neutral-50`;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  setFile(file: File) {
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }
  supprimerFichier() {
    this.selectedFile.set(null);
    this.fileRemoved.emit();
  }
}
