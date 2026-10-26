using BibliotecaApi.DTOs;

namespace BibliotecaApi.Services
{
    public interface IUsuarioService
    {
        Task<List<UsuarioResponseDto>> ObtenerTodosAsync();
        Task<UsuarioResponseDto?> ObtenerPorIdAsync(int id);
        Task<UsuarioResponseDto> CrearAsync(UsuarioRequestDto dto);
        Task<UsuarioResponseDto?> ActualizarAsync(int id, UsuarioRequestDto dto);
        Task<bool> EliminarAsync(int id);
    }
}
