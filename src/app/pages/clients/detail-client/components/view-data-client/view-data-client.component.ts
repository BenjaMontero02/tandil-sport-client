import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Client } from '../../../../../types';
import { ButtonInformationComponent } from '../../../../../components/button-information/button-information.component';
import { Image } from 'primeng/image';
import { CarrouselComponent } from '../../../../../components/carrousel/carrousel.component';
import { formattedDate } from '../../../../../util/utill';

@Component({
  selector: 'app-view-data-client',
  imports: [ Image, ButtonInformationComponent,CarrouselComponent],
  templateUrl: './view-data-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDataClientComponent {
  @Input({ required: true }) client!: Client;
  @Input({ required: true }) tab!: number;
  formattedDate = formattedDate;
}
