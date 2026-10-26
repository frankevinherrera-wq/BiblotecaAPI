import { Signal, computed, signal } from '@angular/core';

/**
 * Búsqueda + paginación del lado del cliente (la API devuelve la lista completa).
 * `fields` indica qué propiedades de cada fila participan en la búsqueda.
 */
export function pagedSearch<T extends object>(
  items: Signal<T[]>,
  fields: (keyof T)[],
  pageSize = 8,
) {
  const term = signal('');
  const page = signal(1);

  const filtered = computed(() => {
    const q = term().trim().toLowerCase();
    if (!q) return items();
    return items().filter((row) =>
      fields.some((f) => String(row[f] ?? '').toLowerCase().includes(q)),
    );
  });

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered().length / pageSize)));

  // Si se borra el último registro de la última página, vuelve a una página válida.
  const currentPage = computed(() => Math.min(page(), totalPages()));

  const rows = computed(() => {
    const start = (currentPage() - 1) * pageSize;
    return filtered().slice(start, start + pageSize);
  });

  return {
    term,
    page: currentPage,
    totalPages,
    total: computed(() => filtered().length),
    rows,
    pageSize,
    setTerm(value: string) {
      term.set(value);
      page.set(1);
    },
    setPage(value: number) {
      page.set(value);
    },
  };
}
