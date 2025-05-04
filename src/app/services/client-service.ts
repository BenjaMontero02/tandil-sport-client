import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, ClientUpdate, Pagination } from '../types';
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
  
  async downloadCredentials(ids: string[]):  Promise<void> {
    const files = await this.http.post(
      '/credentials',
      { ids }
    ).toPromise();

    files.forEach(file => {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${file.base64}`;
      link.download = file.filename;
      link.click();
    });
  }
  updateClient(id: string, client: ClientUpdate): Observable<Client> {
    console.log('ClientService', client);
    return this.http.patch<Client>(`${this.apiUrl}/clients/${id}`, client);
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
