/** Espejo de DetallePedidoResponseDto. */
export interface DetallePedido {
  libroId: number;
  tituloLibro: string;
  cantidad: number;
  precioUnitario: number;
}

/** Espejo de PedidoResponseDto. */
export interface Pedido {
  id: number;
  fechaPedido: string; // ISO 8601 (DateTime serializado por .NET)
  estado: string;
  usuarioId: number;
  nombreUsuario: string;
  detallePedidos: DetallePedido[];
}

export interface DetallePedidoRequest {
  libroId: number;
  cantidad: number;
}

/** Espejo de PedidoRequestDto. El backend NO permite actualizar pedidos (solo crear / eliminar). */
export interface PedidoRequest {
  usuarioId: number;
  detallePedidos: DetallePedidoRequest[];
}
