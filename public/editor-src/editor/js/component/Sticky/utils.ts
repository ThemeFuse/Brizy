import { ObserverProperty } from "./type";

export const observer: ObserverProperty = {
  events: ["load", "scroll"],
  listeners: [],
  framePending: false,

  addEvents() {
    this.notifyListeners = this.notifyListeners.bind(this);

    this.events.forEach((event) => {
      window.addEventListener(event, this.notifyListeners);
    });
  },

  removeEvents() {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.notifyListeners);
    });
  },

  addListener(listener) {
    if (this.listeners.length === 0) {
      this.addEvents();
    }
    this.listeners.push(listener);
  },

  removeListener(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);

    if (this.listeners.length === 0) {
      this.removeEvents();
    }
  },

  notifyListeners() {
    if (!this.framePending) {
      requestAnimationFrame(() => {
        this.framePending = false;

        this.listeners.forEach((listener) => listener());
      });

      this.framePending = true;
    }
  }
};
