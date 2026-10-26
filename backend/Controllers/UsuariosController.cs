using BibliotecaApi.DTOs;
using BibliotecaApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/v1/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<List<UsuarioResponseDto>> ObtenerTodos()
        {
            return await _usuarioService.ObtenerTodosAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<UsuarioResponseDto?> BuscarPorId(int id)
        {
            return await _usuarioService.ObtenerPorIdAsync(id);
        }

        [HttpPost]
        public async Task<UsuarioResponseDto> Crear(UsuarioRequestDto dto)
        {
            return await _usuarioService.CrearAsync(dto);
        }

        [HttpPatch("{id:int}")]
        public async Task<UsuarioResponseDto?> Actualizar(int id, UsuarioRequestDto dto)
        {
            return await _usuarioService.ActualizarAsync(id, dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<bool> Eliminar(int id)
        {
            return await _usuarioService.EliminarAsync(id);
        }
    }
}