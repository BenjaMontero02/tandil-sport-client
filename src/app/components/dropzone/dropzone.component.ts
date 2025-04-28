import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './dropzone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropzoneComponent implements OnInit {
  @Output() onFileSelected = new EventEmitter<File[]>();
  @Output() onClose = new EventEmitter<void>();
  files: File[] | null = null;
  @Input({ required: true }) accept!: string;
  @Input() quantityAcceptedFiles: number = 1;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.onFileSelected.observed) {
      throw new Error(
        'El componente DropzoneComponent requiere que se proporcione un manejador para onFileSelected'
      );
    }
  }

  handleFileSelect(event: Event): void {
    const inputFiles =
      (event as DragEvent).dataTransfer?.files ||
      (event.target as HTMLInputElement).files;

    if (!inputFiles || inputFiles.length === 0) return;

    if (inputFiles.length > this.quantityAcceptedFiles) {
      alert(`Solo se permiten ${this.quantityAcceptedFiles} archivos.`);
    }

    const acceptedExtensions = this.accept
      .split(',')
      .map((ext) => ext.trim().toLowerCase());

    const currentFiles = this.files ? [...this.files] : [];

    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      const alreadyAdded = currentFiles.some((f) => f.name === file.name);
      const isAccepted = acceptedExtensions.includes(ext);

      if (isAccepted && !alreadyAdded) {
        currentFiles.push(file);
      }
    }

    this.files = currentFiles.slice(0, this.quantityAcceptedFiles);
    this.cdr.detectChanges();
  }

  onUpload() {
    this.onFileSelected.emit(this.files!);
    this.files = null; // Reinicia el archivo después de la carga
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Evita el comportamiento predeterminado
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFileSelect({
        target: { files: event.dataTransfer.files },
      } as unknown as Event);
    }
  }
}
