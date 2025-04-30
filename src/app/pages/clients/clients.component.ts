import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../../components/title/title.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { GenericModalComponent } from '../../components/generic-modal/generic-modal.component';
import { DropzoneComponent } from '../../components/dropzone/dropzone.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Client } from '../../types';
import { ButtonInformationComponent } from '../../components/button-information/button-information.component';
import { Checkbox } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client-service';
import { MessageToastService } from '../../services/message-toast-service';
import { ProgressBarLoaderComponent } from '../../components/progress-bar-loader/progress-bar-loader.component';
import { Subject, takeUntil } from 'rxjs';

type Modals = 'modalExcel';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FileUploadModule,
    ButtonModule,
    GenericModalComponent,
    DropzoneComponent,
    ButtonComponent,
    ButtonInformationComponent,
    Checkbox,
    ProgressBarLoaderComponent,
  ],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit, OnDestroy {
  modals = signal<Modals | null>(null); //modales a abrir
  clients = signal<Client[]>([]); // Signal para almacenar los items cargados
  loading = signal<boolean>(true); // Indicador de carga para prevenir múltiples solicitudes simultáneas
  page = signal<number>(1);//Pagina inicial
  totalPages = signal<number>(1);//cantidad de paginas
  openDialog = signal<{ open: boolean; client: Client | null }>({ //objeto para eliminar un cliente
    open: false,
    client: null,
  });
  checkeds: string[] = []; //lista de clientes seleccionados
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private clientService: ClientService,
    private messageService: MessageToastService
  ) {}

  ngOnInit() {
    this.getClients(this.page());
  }

  // Función que simula la llamada a una API, retornando un Observable con un retardo.
  getClients(page: number): void {
    this.clientService
      .getAllClients(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clients.set(data.items);
          this.page.set(data.meta.currentPage);
          this.totalPages.set(data.meta.totalPages); // Cambiar por la cantidad total de páginas
          this.loading.set(false); // Desactiva el indicador de carga al completar con éxito
        },
        error: (error) => {
          this.messageService.onError(error);
          this.loading.set(false); // Desactiva el indicador de carga incluso en caso de error
        },
      });
  }

  onNavigateClient(id: string): void {
    if (this.checkeds.length <= 1 || this.loading()) {
      //console.log('navegando a cliente con dni: ', id);
      this.router.navigate(['clients', id]);
    }
  }

  handleModals(value: Modals | null) {
    this.modals.set(value);
  }

  onSendExcelFile(file: File[]) {
    console.log('[file excel]', file[0]);
    //TODO: enviar archivo file al back para que persista en la db
    this.handleModals(null);
  }

  prevPage(): void {
    this.loading.set(true); // Activa el indicador de carga
    this.getClients(this.page() - 1);
  }

  nextPage(): void {
    this.loading.set(true); // Activa el indicador de carga
    this.getClients(this.page() + 1);
  }

  onDeleteClient(id: string) {
    this.loading.set(true);
    this.clientService
      .deleteClientById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.clients.set(this.clients().filter((client) => client.id !== id));
          this.loading.set(false); // Desactiva el indicador de carga al completar con éxito
          this.messageService.onSuccess(
            'Cliente eliminado',
            'El cliente fue eliminado correctamente'
          );
        },
        error: (error) => {
          this.messageService.onError(error);
          this.loading.set(false); // Desactiva el indicador de carga incluso en caso de error
        },
      });
  }

  isChecked(id: string): boolean {
    return this.checkeds.some((value) => value == id);
  }

  onChecked(id: string) {
    const index = this.checkeds.indexOf(id);
    if (index > -1) {
      this.checkeds.splice(index, 1);
    } else {
      this.checkeds.push(id);
    }
    console.log('checkeds', this.checkeds);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
