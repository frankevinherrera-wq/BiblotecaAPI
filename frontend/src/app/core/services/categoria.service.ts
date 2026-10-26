import { Injectable } from '@angular/core';
import { Categoria, CategoriaRequest } from '../models';
import { CrudService } from './crud.service';

/** Consume /api/v1/categorias */
@Injectable({ providedIn: 'root' })
export class CategoriaService extends CrudService<Categoria, CategoriaRequest> {
  constructor() {
    super('categorias');
  }
}
