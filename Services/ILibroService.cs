using BibliotecaApi.DTOs;

namespace BibliotecaApi.Services
{
    public interface ILibroService
    {
        Task<List<LibroResponseDto>> ObtenerTodosAsync();
        Task<LibroResponseDto?> ObtenerPorIdAsync(int id);
        Task<LibroResponseDto> CrearAsync(LibroRequestDto dto);
        Task<LibroResponseDto?> ActualizarAsync(int id, LibroRequestDto dto);
        Task<bool> EliminarAsync(int id);
    }
}
