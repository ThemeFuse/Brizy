import jQuery from "jquery";
import { createNanoEvents } from "nanoevents";
import initExports from "./initExports";

window.Brz = {
  emitter: createNanoEvents(),
  emittedEvents: {} as Record<string, unknown[][]>,

  on(id: string, f: (...args: unknown[]) => void) {
    return this.emitter.on(id, f);
  },

  emit(id: string, ...args: unknown[]) {
    // Track that this event was emitted (with its args)
    if (!this.emittedEvents[id]) {
      this.emittedEvents[id] = [];
    }
    this.emittedEvents[id].push(args);

    this.emitter.emit(id, ...args);
  },

  onAlways(id: string, f: (...args: unknown[]) => void) {
    // If the event was already emitted, call f immediately for each past emission
    if (this.emittedEvents[id]) {
      for (const args of this.emittedEvents[id]) {
        f(...args);
      }
    }
    
    // Also subscribe for any future emissions
    return this.emitter.on(id, f);
  },
};

// Enhanced init with lazy component loading
window.Brz.on("init.dom", async ($node: JQuery<HTMLElement>) => {
  try {
    await initExports($node);
    window.Brz.emit("init.complete");
  } catch (err) {
    console.error("[Brz] Initialization failed", err);
  }
});

const init = () => {
  if (!window.Brz.isloaded) {
    window.Brz.isloaded = true;

    // Initialize DOM after one frame to ensure
    // the user profile is already attached to "init.dom" events
    requestAnimationFrame(() => {
      window.Brz.emit("init.dom", jQuery(document.body));
    });
  }
};

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}
