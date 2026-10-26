using BibliotecaApi.DTOs;
using BibliotecaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/v1/pedidos")]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidoService _pedidoService;

        public PedidosController(IPedidoService pedidoService)
        {
            _pedidoService = pedidoService;
        }

        [HttpGet]
        public async Task<List<PedidoResponseDto>> ObtenerTodos()
        {
            return await _pedidoService.ObtenerTodosAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<PedidoResponseDto?> BuscarPorId(int id)
        {
            return await _pedidoService.ObtenerPorIdAsync(id);
        }

        [HttpPost]
        public async Task<PedidoResponseDto> Crear(PedidoRequestDto dto)
        {
            return await _pedidoService.CrearAsync(dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<bool> Eliminar(int id)
        {
            return await _pedidoService.EliminarAsync(id);
        }
    }
}