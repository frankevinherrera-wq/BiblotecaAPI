import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autor, AutorRequest } from '../../../core/models';
import { AutorService } from '../../../core/services/autor.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { Modal } from '../../../shared/components/modal/modal';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { pagedSearch } from '../../../shared/utils/paged-search';

/** CRUD de autores (mismo patrón que Usuarios). */
@Component({
  selector: 'app-autores',
  imports: [ReactiveFormsModule, Modal, Pagination],
  templateUrl: './autores.html',
  styleUrl: './autores.css',
})
export class Autores implements OnInit {
  private readonly api = inject(AutorService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly autores = signal<Autor[]>([]);
  protected readonly list = pagedSearch(this.autores, ['nombre', 'nacionalidad']);
  protected readonly editing = signal<Autor | 'new' | null>(null);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    nacionalidad: ['', [Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (data) => {
        this.autores.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.form.reset({ nombre: '', nacionalidad: '' });
    this.editing.set('new');
  }

  protected openEdit(a: Autor): void {
    this.form.reset({ nombre: a.nombre, nacionalidad: a.nacionalidad });
    this.editing.set(a);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected invalid(name: 'nombre' | 'nacionalidad'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body: AutorRequest = this.form.getRawValue();
    const target = this.editing();
    if (target === null) return;

    this.saving.set(true);
    const request$ = target === 'new' ? this.api.create(body) : this.api.update(target.id, body);

    request$.subscribe({
      next: (saved) => {
        if (target === 'new') {
          this.autores.update((l) => [...l, saved]);
          this.toast.success('Autor creado.');
        } else if (!saved) {
          this.toast.error('El autor ya no existe.');
          this.load();
        } else {
          this.autores.update((l) => l.map((x) => (x.id === saved.id ? saved : x)));
          this.toast.success('Autor actualizado.');
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

  protected async remove(a: Autor): Promise<void> {
    const ok = await this.confirm.ask({
      message: `¿Eliminar al autor "${a.nombre}"? Si tiene libros asociados la API puede rechazar la operación.`,
    });
    if (!ok) return;

    this.api.delete(a.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.autores.update((l) => l.filter((x) => x.id !== a.id));
          this.toast.success('Autor eliminado.');
        } else {
          this.toast.error('No se encontró el autor.');
        }
      },
      error: (err: Error) => this.toast.error(err.message),
    });
  }
}
