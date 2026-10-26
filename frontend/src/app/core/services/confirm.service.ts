import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmText: string;
  resolve: (accepted: boolean) => void;
}

/**
 * Diálogo de confirmación basado en promesas:
 *   if (await this.confirm.ask({ message: '¿Eliminar?' })) { ... }
 * El diálogo real lo pinta <app-confirm-dialog /> (una sola vez, en app.html).
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly request = signal<ConfirmRequest | null>(null);

  ask(options: { title?: string; message: string; confirmText?: string }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.request.set({
        title: options.title ?? 'Confirmar acción',
        message: options.message,
        confirmText: options.confirmText ?? 'Eliminar',
        resolve,
      });
    });
  }

  answer(accepted: boolean): void {
    this.request()?.resolve(accepted);
    this.request.set(null);
  }
}
