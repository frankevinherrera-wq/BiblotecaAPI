import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Libro, Pedido, PedidoRequest, Usuario } from '../../../core/models';
import { ConfirmService } from '../../../core/services/confirm.service';
import { LibroService } from '../../../core/services/libro.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Modal } from '../../../shared/components/modal/modal';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { pagedSearch } from '../../../shared/utils/paged-search';

/**
 * Pedidos: listar, ver detalle, crear y eliminar.
 * Eliminar un pedido devuelve el stock a los libros.
 */
@Component({
  selector: 'app-pedidos',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, Modal, Pagination],
  templateUrl: './pedidos.html',
})
export class Pedidos implements OnInit {
  private readonly api = inject(PedidoService);
  private readonly usuarioApi = inject(UsuarioService);
  private readonly libroApi = inject(LibroService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly libros = signal<Libro[]>([]);
  protected readonly list = pagedSearch(this.pedidos, ['id', 'nombreUsuario', 'estado']);

  protected readonly creating = signal(false);
  protected readonly viewing = signal<Pedido | null>(null);

  /** Total de un pedido = Σ cantidad × precio unitario. */
  protected readonly viewingTotal = computed(() =>
    (this.viewing()?.detallePedidos ?? []).reduce((s, d) => s + d.cantidad * d.precioUnitario, 0),
  );

  // Formulario con líneas dinámicas (FormArray): cada línea = libro + cantidad (1-100).
  protected readonly form = this.fb.group({
    usuarioId: [0, [Validators.required, Validators.min(1)]],
    detalles: this.fb.array([this.newLine()]),
  });

  ngOnInit(): void {
    this.load();
  }

  private newLine() {
    return this.fb.group({
      libroId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  protected get lines() {
    return this.form.controls.detalles;
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      pedidos: this.api.getAll(),
      usuarios: this.usuarioApi.getAll(),
      libros: this.libroApi.getAll(),
    }).subscribe({
      next: ({ pedidos, usuarios, libros }) => {
        // Más recientes primero
        this.pedidos.set([...pedidos].sort((a, b) => b.id - a.id));
        this.usuarios.set(usuarios);
        this.libros.set(libros);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.form.reset({ usuarioId: 0 });
    this.lines.clear();
    this.lines.push(this.newLine());
    this.creating.set(true);
  }

  protected addLine(): void {
    this.lines.push(this.newLine());
  }

  protected removeLine(i: number): void {
    if (this.lines.length > 1) this.lines.removeAt(i);
  }

  protected closeForm(): void {
    this.creating.set(false);
  }

  protected stockOf(libroId: number): number | null {
    return this.libros().find((l) => l.id === libroId)?.stock ?? null;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body: PedidoRequest = {
      usuarioId: this.form.controls.usuarioId.value,
      detallePedidos: this.lines.getRawValue(),
    };

    this.saving.set(true);
    this.api.create(body).subscribe({
      next: (created) => {
        this.pedidos.update((l) => [created, ...l]);
        this.toast.success(`Pedido #${created.id} creado.`);
        this.saving.set(false);
        this.closeForm();
        // El stock cambió en el servidor: refrescamos libros para los siguientes pedidos.
        this.libroApi.getAll().subscribe({ next: (libros) => this.libros.set(libros) });
      },
      error: (err: Error) => {
        this.toast.error(err.message);
        this.saving.set(false);
      },
    });
  }

  protected async remove(p: Pedido): Promise<void> {
    const ok = await this.confirm.ask({
      message: `¿Eliminar el pedido #${p.id}? El stock de sus libros será devuelto al inventario.`,
    });
    if (!ok) return;

    this.api.delete(p.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.pedidos.update((l) => l.filter((x) => x.id !== p.id));
          this.toast.success('Pedido eliminado.');
          this.libroApi.getAll().subscribe({ next: (libros) => this.libros.set(libros) });
        } else {
          this.toast.error('No se encontró el pedido.');
        }
      },
      error: (err: Error) => this.toast.error(err.message),
    });
  }
}
