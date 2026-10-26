import { Routes } from '@angular/router';

/**
 * Rutas del panel de administración (lazy: se descarga solo al entrar a /admin).
 */
export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
  { path: 'usuarios', title: 'Usuarios', loadComponent: () => import('./usuarios/usuarios').then((m) => m.Usuarios) },
  { path: 'autores', title: 'Autores', loadComponent: () => import('./autores/autores').then((m) => m.Autores) },
  { path: 'categorias', title: 'Categorías', loadComponent: () => import('./categorias/categorias').then((m) => m.Categorias) },
  { path: 'libros', title: 'Libros', loadComponent: () => import('./libros/libros').then((m) => m.Libros) },
  { path: 'pedidos', title: 'Pedidos', loadComponent: () => import('./pedidos/pedidos').then((m) => m.Pedidos) },
];
