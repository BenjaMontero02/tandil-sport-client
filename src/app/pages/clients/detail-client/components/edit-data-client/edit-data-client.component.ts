import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CarrouselComponent } from '../../../../../components/carrousel/carrousel.component';
import { Image } from 'primeng/image';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageErrorComponent } from '../../../../../components/message-error/message-error.component';
import { formattedDate } from '../../../../../util/utill';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { ButtonComponent } from '../../../../../components/button/button.component';
import { GenericModalComponent } from '../../../../../components/generic-modal/generic-modal.component';
import { DropzoneComponent } from '../../../../../components/dropzone/dropzone.component';
// Ensure the correct path to the image file

type Modals = 'modalPhoto' | 'modalImageHealth';

@Component({
  selector: 'app-edit-data-client',
  imports: [
    Image,
    InputNumber,
    CarrouselComponent,
    ReactiveFormsModule,
    InputTextModule,
    MessageErrorComponent,
    ToggleSwitch,
    TextareaModule,
    ButtonComponent,
    GenericModalComponent,
    DropzoneComponent,
  ],
  templateUrl: './edit-data-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDataClientComponent implements OnDestroy {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) tab!: number;
  modals = signal<Modals | null>(null);
  photo = signal<File | null>(null);
  private objectUrls: string[] = [];
  objectUrl: string | null = null;
  formattedDate = formattedDate;

  getActivities(): FormGroup[] {
    return (this.formGroup.get('activities') as FormArray)
      .controls as FormGroup[];
  }

  removeActivity(index: number): void {
    const activities = this.formGroup.get('activities') as FormArray;
    activities.removeAt(index);
  }

  handleModals(value: Modals | null) {
    this.modals.set(value);
  }

  onSendFile(file: File[]) {
    this.photo.set(file[0]);
    let image = this.photoUrl();
    this.formGroup.get('photo')?.setValue(image);
    this.handleModals(null);
  }

  onSendFilesHealthImages(files: File[]) {
    const newUrls = files.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      this.objectUrls.push(objectUrl); // mantener referencia para limpiar después
      return objectUrl;
    });

    const currentUrls =
      this.formGroup.get('healthData.studyImages')?.value || [];

    this.formGroup
      .get('healthData.studyImages')
      ?.setValue([...currentUrls, ...newUrls]);

    this.handleModals(null);
  }

  removeHealthImage(urlToRemove: string): void {
    // 1. Elimina el objectUrl del array de control manual
    this.objectUrls = this.objectUrls.filter((url) => {
      if (url === urlToRemove) {
        URL.revokeObjectURL(url); // revoca solo el eliminado
        return false; // no lo mantiene en el array
      }
      return true; // mantiene los otros
    });

    // 2. Actualiza el FormControl studyImages eliminando el url
    const currentUrls =
      this.formGroup.get('healthData.studyImages')?.value || [];
    const updatedUrls = currentUrls.filter(
      (url: string) => url !== urlToRemove
    );
    this.formGroup.get('healthData.studyImages')?.setValue(updatedUrls);
  }

  photoUrl(): string {
    const value = this.photo();
    // Limpia el anterior si hay uno
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.objectUrl = URL.createObjectURL(value!);
    return this.objectUrl;
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}
