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
