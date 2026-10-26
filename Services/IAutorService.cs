using BibliotecaApi.DTOs;

namespace BibliotecaApi.Services
{
    public interface IAutorService
    {
        Task<List<AutorResponseDto>> ObtenerTodosAsync();
        Task<AutorResponseDto?> ObtenerPorIdAsync(int id);
        Task<AutorResponseDto> CrearAsync(AutorRequestDto dto);
        Task<AutorResponseDto?> ActualizarAsync(int id, AutorRequestDto dto);
        Task<bool> EliminarAsync(int id);
    }
}