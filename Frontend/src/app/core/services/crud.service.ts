import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Servicio CRUD genérico sobre la API REST de .NET.
 *   TRes = DTO de respuesta, TReq = DTO de petición.
 * Cada entidad extiende esta clase indicando solo su ruta ("usuarios", "libros", ...).
 * Nota: el backend usa PATCH (no PUT) para actualizar.
 */
export abstract class CrudService<TRes, TReq> {
  protected readonly http = inject(HttpClient);
  private readonly baseUrl: string;

  protected constructor(resource: string) {
    this.baseUrl = `${environment.apiUrl}/${resource}`;
  }

  getAll(): Observable<TRes[]> {
    return this.http.get<TRes[]>(this.baseUrl);
  }

  getById(id: number): Observable<TRes> {
    return this.http.get<TRes>(`${this.baseUrl}/${id}`);
  }

  create(body: TReq): Observable<TRes> {
    return this.http.post<TRes>(this.baseUrl, body);
  }

  update(id: number, body: TReq): Observable<TRes> {
    return this.http.patch<TRes>(`${this.baseUrl}/${id}`, body);
  }

  /** La API responde `true` si borró y `false` si no encontró el registro. */
  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
