import "@babel/polyfill";
import jQuery from "jquery";
import { createNanoEvents } from "nanoevents";
import initExports from "./initExports";

if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = [
    "scrollPane",
    "backgroundVideo",
    "parallax",
    "brzSticky",
    "brzThemeIcon",
    "countdown",
    "countdown2"
  ];

  plugins.forEach(plugin => {
    window.jQuery.fn[plugin] = jQuery.fn[plugin];
  });
}

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
