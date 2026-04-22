/**
 * Typed wrapper around the editor's addFilter/removeFilter system.
 * Tracks registered filters for cleanup when plugins unregister.
 */
import { addFilter, removeFilter } from "visual/utils/filters";
import type { FilterRegistry as IFilterRegistry } from "./types";

type FilterCallback = (...args: unknown[]) => unknown;

export class FilterRegistryImpl implements IFilterRegistry {
  private entries: Array<{ name: string; callback: FilterCallback }> = [];

  add(name: string, callback: FilterCallback, priority?: number): () => void {
    addFilter(name, callback, priority);
    this.entries.push({ name, callback });

    return () => {
      removeFilter(name, callback);
      const idx = this.entries.findIndex(
        (e) => e.name === name && e.callback === callback
      );
      if (idx !== -1) {
        this.entries.splice(idx, 1);
      }
    };
  }

  destroy(): void {
    for (const { name, callback } of this.entries) {
      removeFilter(name, callback);
    }
    this.entries = [];
  }
}
