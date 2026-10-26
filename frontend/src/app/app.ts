import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';
import { Toast } from './shared/components/toast/toast';

/** Componente raíz. app.html contiene el layout: navbar cyberpunk + <router-outlet>. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly menuOpen = signal(false);

  protected readonly links = [
    { path: '/dashboard', label: 'Panel' },
    { path: '/admin/usuarios', label: 'Usuarios' },
    { path: '/admin/autores', label: 'Autores' },
    { path: '/admin/categorias', label: 'Categorías' },
    { path: '/admin/libros', label: 'Libros' },
    { path: '/admin/pedidos', label: 'Pedidos' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
