/** Espejo de CategoriaResponseDto. */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}
export type CategoriaRequest = Omit<Categoria, 'id'>;
