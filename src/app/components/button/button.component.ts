import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<any>();
  @Input({required: true}) label!: string;
  @Input() icon: string | undefined = undefined;
  @Input() iconPos: 'left' | 'right' | 'top' | 'bottom' = "left";
  @Input() shadow: boolean = false;
  @Input() rounded: boolean = false;
  @Input({required: true}) typeButton!: "danger" | "info" | "success";
  @Input() disabled: boolean = false;
}

