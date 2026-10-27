import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Autor, Categoria, Libro, LibroRequest } from '../../../core/models';
import { AutorService } from '../../../core/services/autor.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { LibroService } from '../../../core/services/libro.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/components/modal/modal';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { pagedSearch } from '../../../shared/utils/paged-search';

/** CRUD de libros. Carga en paralelo libros + autores + categorías (para los <select>). */
@Component({
  selector: 'app-libros',
  imports: [ReactiveFormsModule, DecimalPipe, Modal, Pagination],
  templateUrl: './libros.html',
})
export class Libros implements OnInit {
  private readonly api = inject(LibroService);
  private readonly autorApi = inject(AutorService);
  private readonly categoriaApi = inject(CategoriaService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly libros = signal<Libro[]>([]);
  protected readonly autores = signal<Autor[]>([]);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly list = pagedSearch(this.libros, ['titulo', 'nombreAutor', 'nombreCategoria']);
  protected readonly editing = signal<Libro | 'new' | null>(null);

  // Mismas reglas que LibroRequestDto: stock 0-1000, precio 0.01-10000, autor y categoría obligatorios.
  protected readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
    precio: [0.01, [Validators.required, Validators.min(0.01), Validators.max(10000)]],
    autorId: [0, [Validators.required, Validators.min(1)]],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      libros: this.api.getAll(),
      autores: this.autorApi.getAll(),
      categorias: this.categoriaApi.getAll(),
    }).subscribe({
      next: ({ libros, autores, categorias }) => {
        this.libros.set(libros);
        this.autores.set(autores);
        this.categorias.set(categorias);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.form.reset({ titulo: '', stock: 0, precio: 0.01, autorId: 0, categoriaId: 0 });
    this.editing.set('new');
  }

  protected openEdit(l: Libro): void {
    this.form.reset({
      titulo: l.titulo,
      stock: l.stock,
      precio: l.precio,
      autorId: l.autorId,
      categoriaId: l.categoriaId,
    });
    this.editing.set(l);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected invalid(name: keyof LibroRequest): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body: LibroRequest = this.form.getRawValue();
    const target = this.editing();
    if (target === null) return;

    this.saving.set(true);
    const request$ = target === 'new' ? this.api.create(body) : this.api.update(target.id, body);

    request$.subscribe({
      next: (saved) => {
        if (target === 'new') {
          this.libros.update((l) => [...l, saved]);
          this.toast.success('Libro creado.');
        } else if (!saved) {
          this.toast.error('El libro ya no existe.');
          this.load();
        } else {
          this.libros.update((l) => l.map((x) => (x.id === saved.id ? saved : x)));
          this.toast.success('Libro actualizado.');
        }
        this.saving.set(false);
        this.closeForm();
      },
      error: (err: Error) => {
        this.toast.error(err.message);
        this.saving.set(false);
      },
    });
  }

  protected async remove(l: Libro): Promise<void> {
    const ok = await this.confirm.ask({
      message: `¿Eliminar el libro "${l.titulo}"? Si aparece en pedidos la API puede rechazar la operación.`,
    });
    if (!ok) return;

    this.api.delete(l.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.libros.update((list) => list.filter((x) => x.id !== l.id));
          this.toast.success('Libro eliminado.');
        } else {
          this.toast.error('No se encontró el libro.');
        }
      },
      error: (err: Error) => this.toast.error(err.message),
    });
  }
}
