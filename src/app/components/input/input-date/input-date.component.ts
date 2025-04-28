import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { ReactiveFormsModule, ControlContainer, FormControlDirective } from '@angular/forms';

@Component({
  selector: 'app-input-date',
  imports: [ReactiveFormsModule, DatePicker],
  templateUrl: './input-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormControlDirective }],
})
export class InputDateComponent {
  @Input({ required: true }) formControlName!: string;
}
