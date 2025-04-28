import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../components/title/title.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { GenericModalComponent } from "../../components/generic-modal/generic-modal.component";
import { DropzoneComponent } from "../../components/dropzone/dropzone.component";
import { TableClientsComponent } from "../../components/tableClients/tableClients.component";
import { ButtonComponent } from "../../components/button/button.component";

type Modals = 'modalExcel'

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, TitleComponent, FileUploadModule, ButtonModule, GenericModalComponent, DropzoneComponent, TableClientsComponent, ButtonComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent{
  modals = signal<Modals | null>(null);

  handleModals(value: Modals | null) {
    this.modals.set(value);
  }

  onSendExcelFile(file: File[]) {
    console.log("[file excel]", file[0])
    //TODO: enviar archivo file al back para que persista en la db
    this.handleModals(null)
  }
}
