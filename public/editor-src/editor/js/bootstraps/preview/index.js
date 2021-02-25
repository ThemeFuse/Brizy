import { createNanoEvents } from "nanoevents";
import initExports from "./initExports";

window.Brizy = {
  emitter: createNanoEvents(),

  on(id, f) {
    return this.emitter.on(id, f);
  },

  emit(id, ...args) {
    this.emitter.emit(id, ...args);
  }
};

window.Brizy.on("init.dom", $node => {
  initExports($node);
});
