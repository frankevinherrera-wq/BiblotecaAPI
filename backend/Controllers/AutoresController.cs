using BibliotecaApi.DTOs;
using BibliotecaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/v1/autores")]
    public class AutoresController : ControllerBase
    {
        private readonly IAutorService _autorService; // 👈 Usando la interfaz aquí

        public AutoresController(IAutorService autorService) // 👈 Usando la interfaz aquí
        {
            _autorService = autorService;
        }

        [HttpGet]
        public async Task<List<AutorResponseDto>> ObtenerTodos()
        {
            return await _autorService.ObtenerTodosAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<AutorResponseDto?> BuscarAutorPorId(int id)
        {
            return await _autorService.ObtenerPorIdAsync(id);
        }

        [HttpPost]
        public async Task<AutorResponseDto> CrearAutor(AutorRequestDto dto)
        {
            return await _autorService.CrearAsync(dto);
        }

        [HttpPatch("{id:int}")]
        public async Task<AutorResponseDto?> ActualizarAutor(int id, AutorRequestDto dto)
        {
            return await _autorService.ActualizarAsync(id, dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<bool> EliminarAutor(int id)
        {
            return await _autorService.EliminarAsync(id);
        }
    }
}