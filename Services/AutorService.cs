using Microsoft.EntityFrameworkCore;
using BibliotecaApi.Data;
using BibliotecaApi.DTOs;
using BibliotecaApi.models;

namespace BibliotecaApi.Services
{
    public class AutorService : IAutorService 
    {
        private readonly AppDbContext _context;

        public AutorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AutorResponseDto>> ObtenerTodosAsync()
        {
            var autores = await _context.Autores.ToListAsync();

            return autores.Select(a => new AutorResponseDto
            {
                Id = a.Id,
                Nombre = a.Nombre,
                Nacionalidad = a.Nacionalidad
            }).ToList();
        }

        public async Task<AutorResponseDto?> ObtenerPorIdAsync(int id)
        {
            var autor = await _context.Autores.FindAsync(id);
            if (autor == null) return null;

            return new AutorResponseDto
            {
                Id = autor.Id,
                Nombre = autor.Nombre,
                Nacionalidad = autor.Nacionalidad
            };
        }

        public async Task<AutorResponseDto> CrearAsync(AutorRequestDto dto)
        {
            var autor = new Autor
            {
                Nombre = dto.Nombre,
                Nacionalidad = dto.Nacionalidad
            };

            _context.Autores.Add(autor);
            await _context.SaveChangesAsync();

            return new AutorResponseDto
            {
                Id = autor.Id,
                Nombre = autor.Nombre,
                Nacionalidad = autor.Nacionalidad
            };
        }

        public async Task<AutorResponseDto?> ActualizarAsync(int id, AutorRequestDto dto)
        {
            var autor = await _context.Autores.FindAsync(id);
            if (autor == null) return null;

            autor.Nombre = dto.Nombre;
            autor.Nacionalidad = dto.Nacionalidad;

            await _context.SaveChangesAsync();

            return new AutorResponseDto
            {
                Id = autor.Id,
                Nombre = autor.Nombre,
                Nacionalidad = autor.Nacionalidad
            };
        }

        public async Task<bool> EliminarAsync(int id)
    {
            var autor = await _context.Autores.FindAsync(id);
            if (autor == null) return false;

            _context.Autores.Remove(autor);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}