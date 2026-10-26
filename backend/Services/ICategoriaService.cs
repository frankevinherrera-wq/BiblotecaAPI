using BibliotecaApi.DTOs;

namespace BibliotecaApi.Services
{
    public interface ICategoriaService
    {
        Task<List<CategoriaResponseDto>> ObtenerTodosAsync();
        Task<CategoriaResponseDto?> ObtenerPorIdAsync(int id);
        Task<CategoriaResponseDto> CrearAsync(CategoriaRequestDto dto);
        Task<CategoriaResponseDto?> ActualizarAsync(int id, CategoriaRequestDto dto);
        Task<bool> EliminarAsync(int id);
    }
}
