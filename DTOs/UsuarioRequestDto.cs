
using System.ComponentModel.DataAnnotations;
namespace BibliotecaApi.DTOs
{
    public class UsuarioRequestDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electronico es obligatorio")]
        [EmailAddress(ErrorMessage = "El formato del correo electronico no es válido")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "El teléfono no puede superar los 20 caracteres")]
        public string Telefono { get; set; } = string.Empty;
    }
}