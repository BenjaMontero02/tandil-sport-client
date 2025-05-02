import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Pagination } from '../types';
import { firstValueFrom, Observable } from 'rxjs';
import { environments } from '../enviroments';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  
  private apiUrl =
    environments.API_PROTOCOL +
    '://' +
    environments.API_URL +
    ':' +
    environments.API_PORT +
    '/api';

  constructor(private http: HttpClient) {}

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client);
  }

  getAllClients(page: number, search: string): Observable<Pagination<Client>> {
    return this.http.get<Pagination<Client>>(this.apiUrl + '/clients', {
      params: { page, search },
    });
  }

  deleteClientById(ids: string[]): Observable<void> {
    return this.http.request<void>('delete', this.apiUrl + '/clients', {
      body: { ids },
    });
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(this.apiUrl + '/clients/' + id);
  }

  async uploadExcel(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await firstValueFrom(
      this.http.post(this.apiUrl + '/clients/excel', formData)
    );
  }
}
