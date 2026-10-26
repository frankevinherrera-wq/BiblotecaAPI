
namespace BibliotecaApi.DTOs
{
    public class LibroResponseDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public int Stock { get; set; }
        public decimal Precio { get; set; }
        

        public int AutorId { get; set; }
        public string NombreAutor { get; set; } = string.Empty;
        
        public int CategoriaId { get; set; }
        public string NombreCategoria { get; set; } = string.Empty;
        
    }
}