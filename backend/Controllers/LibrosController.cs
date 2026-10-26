using BibliotecaApi.DTOs;
using BibliotecaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/v1/libros")]
    public class LibrosController : ControllerBase
    {
        private readonly ILibroService _libroService;

        public LibrosController(ILibroService libroService)
        {
            _libroService = libroService;
        }

        [HttpGet]
        public async Task<List<LibroResponseDto>> ObtenerTodos()
        {
            return await _libroService.ObtenerTodosAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<LibroResponseDto?> BuscarPorId(int id)
        {
            return await _libroService.ObtenerPorIdAsync(id);
        }

        [HttpPost]
        public async Task<LibroResponseDto> Crear(LibroRequestDto dto)
        {
            return await _libroService.CrearAsync(dto);
        }

        [HttpPatch("{id:int}")]
        public async Task<LibroResponseDto?> Actualizar(int id, LibroRequestDto dto)
        {
            return await _libroService.ActualizarAsync(id, dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<bool> Eliminar(int id)
        {
            return await _libroService.EliminarAsync(id);
        }
    }
}