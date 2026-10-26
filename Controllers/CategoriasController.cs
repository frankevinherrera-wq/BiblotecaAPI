using BibliotecaApi.DTOs;
using BibliotecaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/v1/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;

        public CategoriasController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        public async Task<List<CategoriaResponseDto>> ObtenerTodos()
        {
            return await _categoriaService.ObtenerTodosAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<CategoriaResponseDto?> BuscarPorId(int id)
        {
            return await _categoriaService.ObtenerPorIdAsync(id);
        }

        [HttpPost]
        public async Task<CategoriaResponseDto> Crear(CategoriaRequestDto dto)
        {
            return await _categoriaService.CrearAsync(dto);
        }

        [HttpPatch("{id:int}")]
        public async Task<CategoriaResponseDto?> Actualizar(int id, CategoriaRequestDto dto)
        {
            return await _categoriaService.ActualizarAsync(id, dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<bool> Eliminar(int id)
        {
            return await _categoriaService.EliminarAsync(id);
        }
    }
}