using System;
using System.Collections.Generic;


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BibliotecaApi.models
{
    public class DetallePedido
    {
        [Key]
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }


        public int PedidoId { get; set; }
        [ForeignKey("PedidoId")]
        public Pedido? Pedido { get; set; }


        public int LibroId { get; set; }
        [ForeignKey("LibroId")]
        public Libro? Libro { get; set; }
    }
}