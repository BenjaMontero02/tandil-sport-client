import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-information',
  imports: [],
  templateUrl: './button-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonInformationComponent {
  @Input({required: true}) text!: string;
  @Input({required: true}) severity!: 'danger' | 'info' | 'success';
}
