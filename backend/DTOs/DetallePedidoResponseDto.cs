

namespace BibliotecaApi.DTOs
{
    public class DetallePedidoResponseDto
    {
        public int LibroId { get; set; }
        public string TituloLibro { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }
}