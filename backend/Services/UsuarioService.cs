using BibliotecaApi.Data;
using BibliotecaApi.DTOs;
using BibliotecaApi.models; 
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UsuarioResponseDto>> ObtenerTodosAsync()
        {
            var usuarios = await _context.Usuarios
                .AsNoTracking()
                .ToListAsync();

            return usuarios.Select(u => new UsuarioResponseDto
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Email = u.Email,
                Telefono = u.Telefono
            }).ToList();
        }

        public async Task<UsuarioResponseDto?> ObtenerPorIdAsync(int id)
        {
            var usuario = await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null) return null;

            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Telefono = usuario.Telefono
            };
        }

        public async Task<UsuarioResponseDto> CrearAsync(UsuarioRequestDto dto)
        {
            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Telefono = usuario.Telefono
            };
        }

        public async Task<UsuarioResponseDto?> ActualizarAsync(int id, UsuarioRequestDto dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario is null) return null;

            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;
            usuario.Telefono = dto.Telefono;
            
            await _context.SaveChangesAsync();

            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                Telefono = usuario.Telefono
            };
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario is null) return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}