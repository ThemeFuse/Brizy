import { applyFilter } from "visual/utils/filters";

let components = {};
let notFoundComponent;
let shortcodes = {};

const Editor = {
  // components

  registerComponent(component) {
    if (process.env.NODE_ENV === "development") {
      if (!component.componentId) {
        throw new Error(
          "an EditorComponent must have a static componentId property"
        );
      }
    }

    components[component.componentId] = component;
  },

  getComponents() {
    return components;
  },

  getComponent(id) {
    return components[id] || null;
  },

  registerNotFoundComponent(component) {
    notFoundComponent = component;
  },

  getNotFoundComponent() {
    if (!notFoundComponent) {
      throw new Error("NotFoundComponent not registered");
    }

    return notFoundComponent;
  },

  // shortcodes

  registerShortcode(shortcodeComponents) {
    shortcodes = shortcodeComponents;
  },

  getShortcodes() {
    return applyFilter("getShortcodes", shortcodes);
  }
};

export default Editor;
