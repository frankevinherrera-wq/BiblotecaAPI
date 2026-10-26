using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BibliotecaApi.DTOs
{
    public class PedidoResponseDto
    {
        public int Id { get; set; }
        public DateTime FechaPedido { get; set; }
        public string Estado { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public string NombreUsuario { get; set; } = string.Empty; 
        public List<DetallePedidoResponseDto> DetallePedidos { get; set; } = new List<DetallePedidoResponseDto>();
    }
}