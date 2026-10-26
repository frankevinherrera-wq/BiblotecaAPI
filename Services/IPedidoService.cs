using BibliotecaApi.DTOs;

namespace BibliotecaApi.Services
{
    public interface IPedidoService
    {
        Task<List<PedidoResponseDto>> ObtenerTodosAsync();
        Task<PedidoResponseDto?> ObtenerPorIdAsync(int id);
        Task<PedidoResponseDto> CrearAsync(PedidoRequestDto dto);
        Task<bool> EliminarAsync(int id);
    }
}
