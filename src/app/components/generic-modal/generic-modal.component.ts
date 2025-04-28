import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-generic-modal',
  imports: [DialogModule],
  templateUrl: './generic-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericModalComponent {
  @Input({required: true}) visible!: boolean;
  @Input({required: true}) title!: string;
  @Output() onClose = new EventEmitter<void>();
}
