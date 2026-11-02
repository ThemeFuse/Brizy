import type { Select2EventName, Select2Events } from "./types";

type Listeners = {
  [K in keyof Select2Events]: Array<(params: Select2Events[K]) => void>;
};

// An event as a catch-all listener gets it, with a way to send it on unchanged.
interface AnyEvent {
  name: Select2EventName;
  params: Select2Events[Select2EventName];
  relayTo: (target: Observable) => void;
}

type AnyListener = (event: AnyEvent) => void;

const noListeners = (): Listeners => ({
  open: [],
  opening: [],
  close: [],
  closing: [],
  select: [],
  selecting: [],
  unselect: [],
  unselecting: [],
  query: [],
  "results:all": [],
  "results:message": [],
  "results:focus": [],
  "results:select": [],
  "results:toggle": [],
  "results:previous": [],
  "results:next": [],
  "selection:update": [],
  toggle: [],
  focus: [],
  blur: [],
  keypress: [],
  enable: [],
  disable: []
});

export class Observable {
  private listeners: Listeners = noListeners();
  private anyListeners: AnyListener[] = [];

  on<K extends Select2EventName>(
    event: K,
    listener: (params: Select2Events[K]) => void
  ): void {
    this.listeners[event].push(listener);
  }

  onAny(listener: AnyListener): void {
    this.anyListeners.push(listener);
  }

  trigger<K extends Select2EventName>(
    event: K,
    params: Select2Events[K]
  ): void {
    this.invoke(event, params);
  }

  // Listeners added while an event is being sent do not get that event.
  protected invoke<K extends Select2EventName>(
    event: K,
    params: Select2Events[K]
  ): void {
    const listeners = this.listeners[event];

    for (let i = 0, length = listeners.length; i < length; i++) {
      listeners[i](params);
    }

    const any: AnyEvent = {
      name: event,
      params,
      relayTo: (target) => target.trigger(event, params)
    };

    for (let i = 0, length = this.anyListeners.length; i < length; i++) {
      this.anyListeners[i](any);
    }
  }
}
