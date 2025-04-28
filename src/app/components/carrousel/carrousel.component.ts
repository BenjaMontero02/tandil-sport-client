import { ChangeDetectionStrategy, Component, Input, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { ButtonComponent } from "../button/button.component";
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  imports: [Carousel, ButtonModule, GenericModalComponent, ButtonComponent],
  templateUrl: './carrousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrouselComponent {
  @Input({required: true}) images!: string[];
  @Input() isEditing: boolean = false;
  @Output() onDeleteImage = new EventEmitter<string>();

  indexRenderImage = signal<number>(0);
  openDialog = signal<{open: boolean, image: string | null}>({open: false, image: null});

  onNext(){
    if(this.images.length === this.indexRenderImage()){
      this.indexRenderImage.set(0);
    }else{
      this.indexRenderImage.set(this.indexRenderImage() + 1);
    }
  }

  onPrev(){
    if(this.indexRenderImage() === 0){
      this.indexRenderImage.set(this.images.length - 1);
    }else{
      this.indexRenderImage.set(this.indexRenderImage() - 1);
    }
  }
}
