import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, PedidoRequest } from '../models';

/**
 * Consume /api/v1/pedidos.
 * No extiende CrudService porque los pedidos tienen operaciones de stock específicas.
 */
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pedidos`;

  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }

  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  create(body: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, body);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}
