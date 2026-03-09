import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Client, ClientCreateRequest, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Get all clients
   */
  getAll(): Observable<Client[]> {
    return this.http.get<ApiResponse<Client[]>>(`${this.baseUrl}/clients`).pipe(
      map(response => response.data),
      catchError(() => of([]))
    );
  }

  /**
   * Get client by ID
   */
  getById(id: number): Observable<Client | null> {
    return this.http.get<ApiResponse<Client>>(`${this.baseUrl}/clients/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(null))
    );
  }

  /**
   * Create a new client
   */
  create(client: ClientCreateRequest): Observable<Client> {
    return this.http.post<ApiResponse<Client>>(`${this.baseUrl}/clients`, client).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update a client
   */
  update(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<ApiResponse<Client>>(`${this.baseUrl}/clients/${id}`, client).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete a client
   */
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/clients/${id}`).pipe(
      map(() => undefined)
    );
  }
}
