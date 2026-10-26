using System.Data;
using BibliotecaApi.Data;
using BibliotecaApi.DTOs;
using BibliotecaApi.models; // 👈 Ajustado a mayúscula por convención
using Microsoft.EntityFrameworkCore;

namespace BibliotecaApi.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly AppDbContext _context;

        public PedidoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PedidoResponseDto>> ObtenerTodosAsync()
        {
            var pedidos = await _context.Pedidos
                .AsNoTracking()
                .Include(p => p.Usuario)
                .Include(p => p.DetallePedidos)
                    .ThenInclude(d => d.Libro)
                .ToListAsync();

            return pedidos.Select(p => new PedidoResponseDto
            {
                Id = p.Id,
                FechaPedido = p.FechaPedido,
                Estado = p.Estado,
                UsuarioId = p.UsuarioId,
                NombreUsuario = p.Usuario?.Nombre ?? string.Empty,
                DetallePedidos = p.DetallePedidos.Select(detalle => new DetallePedidoResponseDto
                {
                    LibroId = detalle.LibroId,
                    TituloLibro = detalle.Libro?.Titulo ?? string.Empty,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario
                }).ToList()
            }).ToList();
        }

        public async Task<PedidoResponseDto?> ObtenerPorIdAsync(int id)
        {
            var pedido = await _context.Pedidos
                .AsNoTracking()
                .Include(p => p.Usuario)
                .Include(p => p.DetallePedidos)
                    .ThenInclude(d => d.Libro)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null) return null;

            return new PedidoResponseDto
            {
                Id = pedido.Id,
                FechaPedido = pedido.FechaPedido,
                Estado = pedido.Estado,
                UsuarioId = pedido.UsuarioId,
                NombreUsuario = pedido.Usuario?.Nombre ?? string.Empty,
                DetallePedidos = pedido.DetallePedidos.Select(detalle => new DetallePedidoResponseDto
                {
                    LibroId = detalle.LibroId,
                    TituloLibro = detalle.Libro?.Titulo ?? string.Empty,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario
                }).ToList()
            };
        }

        public async Task<PedidoResponseDto> CrearAsync(PedidoRequestDto dto)
        {
            if (dto.UsuarioId <= 0 || !await _context.Usuarios.AnyAsync(u => u.Id == dto.UsuarioId))
            {
                throw new KeyNotFoundException($"No existe el usuario con ID {dto.UsuarioId}.");
            }

            if (dto.DetallePedidos is null || dto.DetallePedidos.Count == 0)
            {
                throw new ArgumentException("El pedido debe incluir al menos un libro.");
            }

            if (dto.DetallePedidos.Any(d => d.LibroId <= 0 || d.Cantidad < 1 || d.Cantidad > 100))
            {
                throw new ArgumentException("Cada detalle debe tener un libro válido y una cantidad entre 1 y 100.");
            }

            await using var transaction = await _context.Database
                .BeginTransactionAsync(IsolationLevel.Serializable);

            var cantidadesPorLibro = dto.DetallePedidos
                .GroupBy(d => d.LibroId)
                .ToDictionary(g => g.Key, g => g.Sum(d => d.Cantidad));

            var libros = await _context.Libros
                .Where(l => cantidadesPorLibro.Keys.Contains(l.Id))
                .ToDictionaryAsync(l => l.Id);

            var libroFaltante = cantidadesPorLibro.Keys.FirstOrDefault(id => !libros.ContainsKey(id));
            if (libroFaltante != 0)
            {
                throw new KeyNotFoundException($"No existe el libro con ID {libroFaltante}.");
            }

            foreach (var (libroId, cantidad) in cantidadesPorLibro)
            {
                var libro = libros[libroId];
                if (libro.Stock < cantidad)
                {
                    throw new InvalidOperationException(
                        $"Stock insuficiente para el libro '{libro.Titulo}'. Disponible: {libro.Stock}.");
                }

                libro.Stock -= cantidad;
            }

            var pedido = new Pedido
            {
                UsuarioId = dto.UsuarioId,
                DetallePedidos = dto.DetallePedidos.Select(detalle => new DetallePedido
                {
                    LibroId = detalle.LibroId,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = libros[detalle.LibroId].Precio
                }).ToList()
            };

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            await _context.Entry(pedido).Reference(p => p.Usuario).LoadAsync();
            foreach (var detalle in pedido.DetallePedidos)
            {
                await _context.Entry(detalle).Reference(d => d.Libro).LoadAsync();
            }

            return new PedidoResponseDto
            {
                Id = pedido.Id,
                FechaPedido = pedido.FechaPedido,
                Estado = pedido.Estado,
                UsuarioId = pedido.UsuarioId,
                NombreUsuario = pedido.Usuario?.Nombre ?? string.Empty,
                DetallePedidos = pedido.DetallePedidos.Select(detalle => new DetallePedidoResponseDto
                {
                    LibroId = detalle.LibroId,
                    TituloLibro = detalle.Libro?.Titulo ?? string.Empty,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario
                }).ToList()
            };
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.DetallePedidos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido is null) return false;

            var cantidadesPorLibro = pedido.DetallePedidos
                .GroupBy(d => d.LibroId)
                .ToDictionary(g => g.Key, g => g.Sum(d => d.Cantidad));

            var libros = await _context.Libros
                .Where(l => cantidadesPorLibro.Keys.Contains(l.Id))
                .ToDictionaryAsync(l => l.Id);

            foreach (var (libroId, cantidad) in cantidadesPorLibro)
            {
                if (libros.TryGetValue(libroId, out var libro))
                {
                    libro.Stock += cantidad;
                }
            }

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}