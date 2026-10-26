using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BibliotecaApi.models
{
    public class Libro
    {
        [Key]
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
         public int AnioPublicacion { get; set; }
        public int Stock { get; set; }
        public decimal Precio { get; set; }


        public int AutorId { get; set; }
        [ForeignKey("AutorId")]
        public Autor? Autor { get; set; }


        public int CategoriaId { get; set; }
        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; }



        public ICollection<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();
        
    }
}