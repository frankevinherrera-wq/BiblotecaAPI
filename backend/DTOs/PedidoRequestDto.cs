using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace BibliotecaApi.DTOs
{
    public class PedidoRequestDto
    {
        [Required(ErrorMessage = "El ID del usuario es obligatorio")]
        public int UsuarioId { get; set; }

        [Required(ErrorMessage = "El pedido debe incluir al menos un libro")]
        public List<DetallePedidoRequestDto> DetallePedidos { get; set; } = new List<DetallePedidoRequestDto>();
    }
        
    
}