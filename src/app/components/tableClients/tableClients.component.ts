import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Client } from '../../types';
import { mockClients } from '../../mock';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router } from '@angular/router';
import { ButtonInformationComponent } from '../button-information/button-information.component';
import { Checkbox } from 'primeng/checkbox';
import { ButtonComponent } from '../button/button.component';
import { ButtonModule } from 'primeng/button';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';

@Component({
  selector: 'app-table-clients',
  imports: [
    TableModule,
    PaginatorModule,
    ButtonInformationComponent,
    ButtonModule,
    ButtonComponent,
    GenericModalComponent,
    Checkbox,
  ],
  templateUrl: './tableClients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableClientsComponent {
  clients = signal<Client[]>([]); // Signal para almacenar los items cargados
  loading: boolean = false; // Indicador de carga para prevenir múltiples solicitudes simultáneas
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  openDialog = signal<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });
  checkeds: string[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.getClients(this.currentPage() - 1);
  }

  // Función que simula la llamada a una API, retornando un Observable con un retardo.
  getClients(page: number): void {
    this.clients.set(mockClients[page]);
    //TODO: OBTENER CLIENTES
  }

  onNavigateClient(id: string): void {
    console.log('navegando a cliente con dni: ', id);
    this.router.navigate(['clients', id]);
  }

  prevPage(): void {
    console.log('event del page');
    //TODO: CAMBIAR DE PAGINA EN LA OBTENCION DE CLIENTES
  }

  nextPage(): void {
    //TODO: CAMBIAR DE PAGINA EN LA OBTENCION DE CLIENTES
  }

  onDeleteClient(id: string) {
    console.log('eliminar cliente');
    //TODO:  eliminar cliente
  }

  //TODO:  TEstear checked con clientes cn id
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
  }
}
