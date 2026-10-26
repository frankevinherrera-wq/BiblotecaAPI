
using System.ComponentModel.DataAnnotations;
namespace BibliotecaApi.DTOs
{
    public class DetallePedidoRequestDto
    {
        [Required]
        public int LibroId { get; set; }

        [Range(1, 100, ErrorMessage = "La cantidad minima es 1")]
        public int Cantidad { get; set; }
        
    }
}