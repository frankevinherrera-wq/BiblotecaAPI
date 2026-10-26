
using System.ComponentModel.DataAnnotations;
namespace BibliotecaApi.DTOs
{
    public class CategoriaRequestDto
    {
        [Required(ErrorMessage = "El nombre de la categoria es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre no puede superar los 50 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(200, ErrorMessage = "La descripcion es demasiado larga")]
        public string Descripcion { get; set; } = string.Empty;
    }
}