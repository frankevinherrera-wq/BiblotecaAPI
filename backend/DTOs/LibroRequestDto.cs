using System.ComponentModel.DataAnnotations;

namespace BibliotecaApi.DTOs
{
    public class LibroRequestDto
    {
        [Required(ErrorMessage = "El titulo es obligatorio")]
        [StringLength(150, ErrorMessage = "El titulo es demasiado largo")]
        public string Titulo { get; set; } = string.Empty;

        [Range(0, 1000, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; }

        [Range(0.01, 10000.00, ErrorMessage = "El precio debe ser mayor a cero")]
        public decimal Precio { get; set; }

        [Required(ErrorMessage = "Debe especificar el Autor")]
        public int AutorId { get; set; }

        [Required(ErrorMessage = "Debe especificar la Categoria")]
        public int CategoriaId { get; set; }
    }
}