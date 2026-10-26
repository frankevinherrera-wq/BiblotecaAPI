using BibliotecaApi.Data;
using BibliotecaApi.DTOs;
using BibliotecaApi.models;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly AppDbContext _context;

        public CategoriaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoriaResponseDto>> ObtenerTodosAsync()
        {
            var categorias = await _context.Categorias.ToListAsync();

            return categorias.Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion
            }).ToList();
        }

        public async Task<CategoriaResponseDto?> ObtenerPorIdAsync(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return null;

            return new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nombre = categoria.Nombre,
                Descripcion = categoria.Descripcion
            };
        }

        public async Task<CategoriaResponseDto> CrearAsync(CategoriaRequestDto dto)
        {
            var categoria = new Categoria
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nombre = categoria.Nombre,
                Descripcion = categoria.Descripcion
            };
        }

        public async Task<CategoriaResponseDto?> ActualizarAsync(int id, CategoriaRequestDto dto)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return null;

            categoria.Nombre = dto.Nombre;
            categoria.Descripcion = dto.Descripcion;
            
            await _context.SaveChangesAsync();

            return new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nombre = categoria.Nombre,
                Descripcion = categoria.Descripcion
            };
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return false;

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}