using System.ComponentModel.DataAnnotations;
namespace BibliotecaApi.DTOs
{
    public class AutorRequestDto
    {
        [Required(ErrorMessage = "El nombre del autor es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "La nacionalidad no puede superar los 50 caracteres")]
        public string Nacionalidad { get; set; } = string.Empty;
        
    }
}