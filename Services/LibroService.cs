using BibliotecaApi.Data;
using BibliotecaApi.DTOs;
using BibliotecaApi.models;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Services
{
    public class LibroService : ILibroService
    {
        private readonly AppDbContext _context;

        public LibroService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LibroResponseDto>> ObtenerTodosAsync()
        {
            var libros = await _context.Libros
                .AsNoTracking()
                .Include(l => l.Autor)
                .Include(l => l.Categoria)
                .ToListAsync();

            return libros.Select(l => new LibroResponseDto
            {
                Id = l.Id,
                Titulo = l.Titulo,
                Stock = l.Stock,
                Precio = l.Precio,
                AutorId = l.AutorId,
                NombreAutor = l.Autor?.Nombre ?? string.Empty,
                CategoriaId = l.CategoriaId,
                NombreCategoria = l.Categoria?.Nombre ?? string.Empty
            }).ToList();
        }

        public async Task<LibroResponseDto?> ObtenerPorIdAsync(int id)
        {
            var libro = await _context.Libros
                .AsNoTracking()
                .Include(l => l.Autor)
                .Include(l => l.Categoria)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (libro == null) return null;

            return new LibroResponseDto
            {
                Id = libro.Id,
                Titulo = libro.Titulo,
                Stock = libro.Stock,
                Precio = libro.Precio,
                AutorId = libro.AutorId,
                NombreAutor = libro.Autor?.Nombre ?? string.Empty,
                CategoriaId = libro.CategoriaId,
                NombreCategoria = libro.Categoria?.Nombre ?? string.Empty
            };
        }

        public async Task<LibroResponseDto> CrearAsync(LibroRequestDto dto)
        {
            if (dto.AutorId <= 0 || !await _context.Autores.AnyAsync(a => a.Id == dto.AutorId))
            {
                throw new KeyNotFoundException($"No existe el autor con ID {dto.AutorId}.");
            }

            if (dto.CategoriaId <= 0 || !await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
            {
                throw new KeyNotFoundException($"No existe la categoría con ID {dto.CategoriaId}.");
            }

            var libro = new Libro
            {
                Titulo = dto.Titulo,
                Stock = dto.Stock,
                Precio = dto.Precio,
                AutorId = dto.AutorId,
                CategoriaId = dto.CategoriaId
            };

            _context.Libros.Add(libro);
            await _context.SaveChangesAsync();

            await _context.Entry(libro).Reference(l => l.Autor).LoadAsync();
            await _context.Entry(libro).Reference(l => l.Categoria).LoadAsync();

            return new LibroResponseDto
            {
                Id = libro.Id,
                Titulo = libro.Titulo,
                Stock = libro.Stock,
                Precio = libro.Precio,
                AutorId = libro.AutorId,
                NombreAutor = libro.Autor?.Nombre ?? string.Empty,
                CategoriaId = libro.CategoriaId,
                NombreCategoria = libro.Categoria?.Nombre ?? string.Empty
            };
        }

        public async Task<LibroResponseDto?> ActualizarAsync(int id, LibroRequestDto dto)
        {
            var libro = await _context.Libros
                .Include(l => l.Autor)
                .Include(l => l.Categoria)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (libro is null) return null;

            // Validaciones directas aquí mismo
            if (dto.AutorId <= 0 || !await _context.Autores.AnyAsync(a => a.Id == dto.AutorId))
            {
                throw new KeyNotFoundException($"No existe el autor con ID {dto.AutorId}.");
            }

            if (dto.CategoriaId <= 0 || !await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId))
            {
                throw new KeyNotFoundException($"No existe la categoría con ID {dto.CategoriaId}.");
            }

            libro.Titulo = dto.Titulo;
            libro.Stock = dto.Stock;
            libro.Precio = dto.Precio;
            libro.AutorId = dto.AutorId;
            libro.CategoriaId = dto.CategoriaId;

            await _context.SaveChangesAsync();
            
            await _context.Entry(libro).Reference(l => l.Autor).LoadAsync();
            await _context.Entry(libro).Reference(l => l.Categoria).LoadAsync();

            return new LibroResponseDto
            {
                Id = libro.Id,
                Titulo = libro.Titulo,
                Stock = libro.Stock,
                Precio = libro.Precio,
                AutorId = libro.AutorId,
                NombreAutor = libro.Autor?.Nombre ?? string.Empty,
                CategoriaId = libro.CategoriaId,
                NombreCategoria = libro.Categoria?.Nombre ?? string.Empty
            };
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var libro = await _context.Libros.FindAsync(id);
            if (libro is null) return false;

            _context.Libros.Remove(libro);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}