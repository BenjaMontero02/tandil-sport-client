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
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
} from 'rxjs';

type Modals = 'modalExcel' | 'modalDelete';

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
  page = signal<number>(1); //Pagina inicial
  totalPages = signal<number>(1); //cantidad de paginas
  openDialog = signal<{ open: boolean; client: Client | null }>({
    //objeto para eliminar un cliente
    open: false,
    client: null,
  });
  checkeds: string[] = []; //lista de clientes seleccionados
  private destroy$ = new Subject<void>();
  search$ = new BehaviorSubject<string>(''); // permite getValue()

  constructor(
    private router: Router,
    private clientService: ClientService,
    private messageService: MessageToastService
  ) {}

  ngOnInit() {
    this.search$
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((term) => {
        this.getClients(1, term);
      });
    //this.getClients(this.page());
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement; // type cast explícito
    this.search$.next(input.value);
  }
  // Función que simula la llamada a una API, retornando un Observable con un retardo.
  getClients(page: number, search: string): void {
    this.clientService
      .getAllClients(page, search)
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

  //obtengo de nuevo los clientes
  reloadClients() {
    this.getClients(1, this.search$.getValue());
  }

  async onSendExcelFile(file: File[]) {
    console.log('[file excel]', file[0]);
    //TODO: enviar archivo file al back para que persista en la db
    this.handleModals(null);
    this.loading.set(true); // Activa el indicador de carga
    await this.clientService
      .uploadExcel(file[0])
      .then(() => {
        this.messageService.onSuccess(
          'Carga de clientes',
          'Los clientes fueron cargados correctamente'
        );
        this.reloadClients();
      })
      .catch((error) => {
        this.messageService.onError(error);
      })
      .finally(() => {
        this.loading.set(false); // Desactiva el indicador de carga al completar con éxito
      });
  }

  prevPage(): void {
    this.loading.set(true); // Activa el indicador de carga
    this.getClients(this.page() - 1, this.search$.getValue());
  }

  nextPage(): void {
    this.loading.set(true); // Activa el indicador de carga
    this.getClients(this.page() + 1, this.search$.getValue());
  }

  onDeleteClient(id: string[]) {
    this.loading.set(true);
    this.clientService
      .deleteClientById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.onSuccess(
            'Cliente eliminado',
            'El cliente fue eliminado correctamente'
          );
        },
        error: (error) => {
          this.messageService.onError(error);
        },

        complete: () => {
          this.getClients(this.page(), this.search$.getValue());
          this.checkeds = [];
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
    //console.log('checkeds', this.checkeds);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
