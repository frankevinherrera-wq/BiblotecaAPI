import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AutorService } from '../../core/services/autor.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { LibroService } from '../../core/services/libro.service';
import { PedidoService } from '../../core/services/pedido.service';
import { UsuarioService } from '../../core/services/usuario.service';

interface Stat {
  label: string;
  value: number;
  link: string;
}

/** Resumen con el conteo de cada entidad (consulta las 5 listas en paralelo). */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly usuarios = inject(UsuarioService);
  private readonly autores = inject(AutorService);
  private readonly categorias = inject(CategoriaService);
  private readonly libros = inject(LibroService);
  private readonly pedidos = inject(PedidoService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly stats = signal<Stat[]>([]);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      u: this.usuarios.getAll(),
      a: this.autores.getAll(),
      c: this.categorias.getAll(),
      l: this.libros.getAll(),
      p: this.pedidos.getAll(),
    }).subscribe({
      next: ({ u, a, c, l, p }) => {
        this.stats.set([
          { label: 'Usuarios', value: u.length, link: '/admin/usuarios' },
          { label: 'Autores', value: a.length, link: '/admin/autores' },
          { label: 'Categorías', value: c.length, link: '/admin/categorias' },
          { label: 'Libros', value: l.length, link: '/admin/libros' },
          { label: 'Pedidos', value: p.length, link: '/admin/pedidos' },
        ]);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
