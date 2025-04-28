import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-input-number',
  imports: [ReactiveFormsModule, InputNumber],
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent {
  @Input({ required: true }) value!: string;
}
