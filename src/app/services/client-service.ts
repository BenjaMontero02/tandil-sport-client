import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Pagination } from '../types';
import { Observable } from 'rxjs';
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

  getAllClients(page: number): Observable<Pagination<Client>> {
    return this.http.get<Pagination<Client>>(this.apiUrl + '/clients', {
      params: { page },
    });
  }

  deleteClientById(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/clients/' + id);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(this.apiUrl + '/clients/' + id);
  }
}
