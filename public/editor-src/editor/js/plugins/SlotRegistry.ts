/**
 * Stores UI slot contributions from plugins.
 * Plugins call add() to register components into named slots (e.g. "leftSidebar.drawer").
 */
import type {
  SlotRegistry as ISlotRegistry,
  SlotContribution,
  SlotName
} from "./types";

const DEFAULT_ORDER = 100;

export class SlotRegistryImpl implements ISlotRegistry {
  private contributions = new Map<SlotName, SlotContribution[]>();

  add(slot: SlotName, contribution: SlotContribution): () => void {
    let list = this.contributions.get(slot);

    if (!list) {
      list = [];
      this.contributions.set(slot, list);
    }

    list.push(contribution);

    return () => {
      const items = this.contributions.get(slot);
      if (items) {
        const idx = items.indexOf(contribution);
        if (idx !== -1) {
          items.splice(idx, 1);
        }
      }
    };
  }

  get(slot: SlotName): SlotContribution[] {
    const items = this.contributions.get(slot) ?? [];
    return [...items].sort(
      (a, b) => (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER)
    );
  }

  getAll(): Map<SlotName, SlotContribution[]> {
    const result = new Map<SlotName, SlotContribution[]>();
    for (const slot of this.contributions.keys()) {
      result.set(slot, this.get(slot));
    }
    return result;
  }

  destroy(): void {
    this.contributions.clear();
  }
}
