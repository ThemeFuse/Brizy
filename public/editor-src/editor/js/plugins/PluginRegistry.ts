/**
 * Manages plugin lifecycle: registers plugins, stores cleanup callbacks,
 * and provides access to slot contributions and the tool server.
 */
import type { EditorAPIParts } from "./EditorAPI";
import type { ToolServerImpl } from "./ToolServer";
import type {
  EditorAPI,
  EditorPlugin,
  SlotContribution,
  SlotName
} from "./types";

export class PluginRegistry {
  private cleanups = new Map<string, () => void>();
  private readonly parts: EditorAPIParts;

  constructor(parts: EditorAPIParts) {
    this.parts = parts;
  }

  get api(): EditorAPI {
    return this.parts.api;
  }

  get toolServer(): ToolServerImpl {
    return this.parts.toolServer;
  }

  registerAll(plugins: EditorPlugin[]): void {
    for (const plugin of plugins) {
      if (this.cleanups.has(plugin.id)) {
        // eslint-disable-next-line no-console
        console.warn(
          `Plugin "${plugin.id}" is already registered, skipping duplicate`
        );
        continue;
      }

      try {
        const cleanup = plugin.register(this.parts.api);
        this.cleanups.set(plugin.id, cleanup ?? (() => undefined));
      } catch (e) {
        console.error(`Plugin "${plugin.id}" failed to register:`, e);
      }
    }
  }

  getSlotContributions(slot: SlotName): SlotContribution[] {
    return this.parts.slotRegistry.get(slot);
  }

  destroy(): void {
    for (const [id, cleanup] of this.cleanups.entries()) {
      try {
        cleanup();
      } catch (e) {
        console.error(`Plugin "${id}" cleanup failed:`, e);
      }
    }
    this.cleanups.clear();
    this.parts.slotRegistry.destroy();
    this.parts.filterRegistry.destroy();
    this.parts.eventBus.destroy();
  }
}
