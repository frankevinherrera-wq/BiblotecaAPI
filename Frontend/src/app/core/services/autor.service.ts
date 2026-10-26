import { Injectable } from '@angular/core';
import { Autor, AutorRequest } from '../models';
import { CrudService } from './crud.service';

/** Consume /api/v1/autores */
@Injectable({ providedIn: 'root' })
export class AutorService extends CrudService<Autor, AutorRequest> {
  constructor() {
    super('autores');
  }
}
