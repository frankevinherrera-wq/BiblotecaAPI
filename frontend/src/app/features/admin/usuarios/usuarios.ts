import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario, UsuarioRequest } from '../../../core/models';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Modal } from '../../../shared/components/modal/modal';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { pagedSearch } from '../../../shared/utils/paged-search';

/** CRUD de usuarios: listado con búsqueda + paginación, alta, edición y borrado con confirmación. */
@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, Modal, Pagination],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private readonly api = inject(UsuarioService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  // Estados de la pantalla: loading / error / data
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly usuarios = signal<Usuario[]>([]);

  // Búsqueda + paginación (cliente)
  protected readonly list = pagedSearch(this.usuarios, ['nombre', 'email', 'telefono']);

  // Formulario modal: null = cerrado, 'new' = crear, Usuario = editar
  protected readonly editing = signal<Usuario | 'new' | null>(null);

  // Reactive Form con las mismas reglas que UsuarioRequestDto en C#
  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.form.reset({ nombre: '', email: '', telefono: '' });
    this.editing.set('new');
  }

  protected openEdit(u: Usuario): void {
    this.form.reset({ nombre: u.nombre, email: u.email, telefono: u.telefono });
    this.editing.set(u);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected invalid(name: 'nombre' | 'email' | 'telefono'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body: UsuarioRequest = this.form.getRawValue();
    const target = this.editing();
    if (target === null) return;

    this.saving.set(true);
    const request$ = target === 'new' ? this.api.create(body) : this.api.update(target.id, body);

    request$.subscribe({
      next: (saved) => {
        if (target === 'new') {
          this.usuarios.update((l) => [...l, saved]);
          this.toast.success('Usuario creado.');
        } else {
          // La API puede devolver 204 (null) si el id ya no existe.
          if (!saved) {
            this.toast.error('El usuario ya no existe.');
            this.load();
          } else {
            this.usuarios.update((l) => l.map((x) => (x.id === saved.id ? saved : x)));
            this.toast.success('Usuario actualizado.');
          }
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

  protected async remove(u: Usuario): Promise<void> {
    const ok = await this.confirm.ask({
      message: `¿Eliminar al usuario "${u.nombre}"? Esta acción no se puede deshacer.`,
    });
    if (!ok) return;

    this.api.delete(u.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.usuarios.update((l) => l.filter((x) => x.id !== u.id));
          this.toast.success('Usuario eliminado.');
        } else {
          this.toast.error('No se encontró el usuario.');
        }
      },
      error: (err: Error) => this.toast.error(err.message),
    });
  }
}
