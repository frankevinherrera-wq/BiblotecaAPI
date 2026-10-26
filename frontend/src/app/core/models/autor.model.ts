/** Espejo de AutorResponseDto. */
export interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}
export type AutorRequest = Omit<Autor, 'id'>;
