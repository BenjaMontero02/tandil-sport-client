import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-error',
  imports: [],
  templateUrl: './message-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageErrorComponent {
  @Input({required: true}) hasError!: boolean;
  @Input({required: true}) errorMessage!: string;
}
