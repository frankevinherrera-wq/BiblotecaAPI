import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Error ya normalizado que consumen los componentes (`err.message`). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * Convierte cualquier HttpErrorResponse en un ApiError con mensaje legible:
 *  - 0   → API apagada / CORS / sin red
 *  - 400 → errores de validación de ASP.NET (ProblemDetails.errors)
 *  - 5xx → error del servidor (incluye KeyNotFound / stock insuficiente lanzados por el backend)
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      return throwError(() => new ApiError(describe(err), err.status));
    }),
  );
};

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

function describe(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No se pudo conectar con la API. Verifica que el backend esté encendido.';
  }

  const body = err.error as ProblemDetails | string | null;

  if (body && typeof body === 'object') {
    if (body.errors) return Object.values(body.errors).flat().join(' · ');
    if (body.detail) return body.detail;
    if (body.title) return body.title;
  }

  switch (err.status) {
    case 400: return 'Datos inválidos.';
    case 401: return 'Tu sesión expiró.';
    case 403: return 'No tienes permiso para esta acción.';
    case 404: return 'Registro no encontrado.';
    case 409: return 'Conflicto con el estado actual del registro.';
    default:
      return err.status >= 500
        ? 'El servidor no pudo completar la operación (¿registro relacionado, stock insuficiente o ID inexistente?).'
        : `Error ${err.status}.`;
  }
}
