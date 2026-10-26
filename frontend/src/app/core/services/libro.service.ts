import { Injectable } from '@angular/core';
import { Libro, LibroRequest } from '../models';
import { CrudService } from './crud.service';

/** Consume /api/v1/libros */
@Injectable({ providedIn: 'root' })
export class LibroService extends CrudService<Libro, LibroRequest> {
  constructor() {
    super('libros');
  }
}
