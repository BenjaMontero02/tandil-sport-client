import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-progress-bar-loader',
  imports: [ProgressBar],
  templateUrl: './progress-bar-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarLoaderComponent {
  @Input({ required: true }) loading!: Signal<boolean>;
}
