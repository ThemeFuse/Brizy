import { applyFilter } from "visual/utils/filters";
import type { Shortcodes } from "visual/types";
import type { EditorInstance as EditorComponent } from "visual/editorComponents/EditorComponent";

const components: Record<string, EditorComponent | null> = {};
let notFoundComponent: undefined | EditorComponent;
let shortcodes: Shortcodes = {};
let shopifyShortcodes: Shortcodes = {};

const Editor = {
  // components

  registerComponent(component: EditorComponent): void {
    if (process.env.NODE_ENV === "development") {
      if (!component.componentId) {
        throw new Error(
          "an EditorComponent must have a static componentId property"
        );
      }
    }

    components[component.componentId] = component;
  },

  getComponents(): Record<string, EditorComponent | null> {
    return components;
  },

  getComponent(id: string): EditorComponent | null {
    return components[id] || null;
  },

  registerNotFoundComponent(component: EditorComponent): void {
    notFoundComponent = component;
  },

  getNotFoundComponent(): EditorComponent {
    if (!notFoundComponent) {
      throw new Error("NotFoundComponent not registered");
    }

    return notFoundComponent;
  },

  // shortcodes

  registerShortcode(shortcodeComponents: Shortcodes): void {
    shortcodes = shortcodeComponents;
  },

  registerShopifyShortcode(shopifyComponents: Shortcodes): void {
    shopifyShortcodes = shopifyComponents;
  },

  getShortcodes(): Shortcodes {
    return applyFilter("getShortcodes", shortcodes);
  },

  getShopifyShortcodes(): Shortcodes {
    return applyFilter("getShopifyShortcodes", shopifyShortcodes);
  }
};

export default Editor;
