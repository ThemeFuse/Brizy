/**
 * Typed wrapper around UIEvents.
 * Provides subscribe/emit with automatic unsubscribe on cleanup.
 */
import UIEvents from "visual/global/UIEvents";
import type { EventBus as IEventBus } from "./types";

type EventHandler = (...args: unknown[]) => void;

export class EventBusImpl implements IEventBus {
  private handlers: Array<{ event: string; handler: EventHandler }> = [];

  on(event: string, handler: EventHandler): () => void {
    UIEvents.on(event, handler);
    this.handlers.push({ event, handler });

    return () => {
      UIEvents.off(event, handler);
      const idx = this.handlers.findIndex(
        (h) => h.event === event && h.handler === handler
      );
      if (idx !== -1) this.handlers.splice(idx, 1);
    };
  }

  emit(event: string, data?: unknown): void {
    UIEvents.emit(event, data);
  }

  destroy(): void {
    for (const { event, handler } of this.handlers) {
      UIEvents.off(event, handler);
    }
    this.handlers = [];
  }
}
