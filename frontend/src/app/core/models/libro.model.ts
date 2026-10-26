/** Espejo de LibroResponseDto (incluye nombres desnormalizados de autor y categoría). */
export interface Libro {
  id: number;
  titulo: string;
  stock: number;
  precio: number;
  autorId: number;
  nombreAutor: string;
  categoriaId: number;
  nombreCategoria: string;
}

/** Espejo de LibroRequestDto. */
export interface LibroRequest {
  titulo: string;
  stock: number;
  precio: number;
  autorId: number;
  categoriaId: number;
}
