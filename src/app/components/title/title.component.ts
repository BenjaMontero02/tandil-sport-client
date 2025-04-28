import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input({required: true}) value!: string;
  @Input({required: true}) classColor!: string;
}
