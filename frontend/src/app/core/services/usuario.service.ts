import { Injectable } from '@angular/core';
import { Usuario, UsuarioRequest } from '../models';
import { CrudService } from './crud.service';

/** Consume GET/POST/PATCH/DELETE  /api/v1/usuarios */
@Injectable({ providedIn: 'root' })
export class UsuarioService extends CrudService<Usuario, UsuarioRequest> {
  constructor() {
    super('usuarios');
  }
}
