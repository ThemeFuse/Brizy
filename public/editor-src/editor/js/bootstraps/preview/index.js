import jQuery from "jquery";
import { createNanoEvents } from "nanoevents";
import initExports from "./initExports";

window.Brz = {
  emitter: createNanoEvents(),

  on(id, f) {
    return this.emitter.on(id, f);
  },

  emit(id, ...args) {
    this.emitter.emit(id, ...args);
  }
};

window.Brz.on("init.dom", ($node) => {
  initExports($node);
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
