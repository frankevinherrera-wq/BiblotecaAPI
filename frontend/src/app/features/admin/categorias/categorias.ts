import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria, CategoriaRequest } from '../../../core/models';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/components/modal/modal';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { pagedSearch } from '../../../shared/utils/paged-search';

/** CRUD de categorías (mismo patrón que Usuarios). */
@Component({
  selector: 'app-categorias',
  imports: [ReactiveFormsModule, Modal, Pagination],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly api = inject(CategoriaService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly list = pagedSearch(this.categorias, ['nombre', 'descripcion']);
  protected readonly editing = signal<Categoria | 'new' | null>(null);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    descripcion: ['', [Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.form.reset({ nombre: '', descripcion: '' });
    this.editing.set('new');
  }

  protected openEdit(c: Categoria): void {
    this.form.reset({ nombre: c.nombre, descripcion: c.descripcion });
    this.editing.set(c);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected invalid(name: 'nombre' | 'descripcion'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body: CategoriaRequest = this.form.getRawValue();
    const target = this.editing();
    if (target === null) return;

    this.saving.set(true);
    const request$ = target === 'new' ? this.api.create(body) : this.api.update(target.id, body);

    request$.subscribe({
      next: (saved) => {
        if (target === 'new') {
          this.categorias.update((l) => [...l, saved]);
          this.toast.success('Categoría creada.');
        } else if (!saved) {
          this.toast.error('La categoría ya no existe.');
          this.load();
        } else {
          this.categorias.update((l) => l.map((x) => (x.id === saved.id ? saved : x)));
          this.toast.success('Categoría actualizada.');
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

  protected async remove(c: Categoria): Promise<void> {
    const ok = await this.confirm.ask({
      message: `¿Eliminar la categoría "${c.nombre}"? Si tiene libros asociados la API puede rechazar la operación.`,
    });
    if (!ok) return;

    this.api.delete(c.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.categorias.update((l) => l.filter((x) => x.id !== c.id));
          this.toast.success('Categoría eliminada.');
        } else {
          this.toast.error('No se encontró la categoría.');
        }
      },
      error: (err: Error) => this.toast.error(err.message),
    });
  }
}
