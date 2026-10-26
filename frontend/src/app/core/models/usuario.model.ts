/** Espejo de UsuarioResponseDto (C#). */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

/** Espejo de UsuarioRequestDto: lo que se envía en POST / PATCH. */
export type UsuarioRequest = Omit<Usuario, 'id'>;
