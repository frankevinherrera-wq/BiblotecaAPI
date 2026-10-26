import { Component, input, output } from '@angular/core';

/** Ventana modal genérica. Contenido proyectado con <ng-content>. */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly title = input.required<string>();
  readonly closed = output<void>();
}
