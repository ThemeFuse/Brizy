import { ComponentType } from "react";
import { flatten } from "underscore";
import type { EditorInstance as EditorComponent } from "visual/editorComponents/EditorComponent";
import {
  ThirdPartyComponent,
  ThirdPartyConfig
} from "visual/global/Config/types/configs/ThirdParty";
import type { Shortcode, Shortcodes } from "visual/types";
import { applyFilter } from "visual/utils/filters";
import { MValue } from "visual/utils/value";

const components: Record<string, EditorComponent | null> = {};
let notFoundComponent: undefined | EditorComponent;
let shortcodes: Shortcodes = {};
let shopifyShortcodes: Shortcodes = {};
const thirdPartyShortcodes: Record<
  string,
  {
    component: { editor: ComponentType; view: ComponentType };
    config: ThirdPartyConfig;
  }
> = {};

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

  getShortcode(id: string): MValue<Shortcode> {
    const shortcodes = this.getShortcodes();
    const flattenShortcodes = flatten(Object.values(shortcodes));
    return flattenShortcodes.find((shortcode) => shortcode.component.id === id);
  },

  getShopifyShortcodes(): Shortcodes {
    return applyFilter("getShopifyShortcodes", shopifyShortcodes);
  },

  registerThirdPartyElement(element: ThirdPartyComponent): void {
    const validConfig = isValidThirdPartyConfig(element);

    if (!validConfig) {
      throw new Error("Invalid third party element config");
    }

    const { category } = element;
    const elementCategory = category ?? "customComponent";
    const elementShortcode = elementCategory.toUpperCase();

    if (!shortcodes[elementShortcode]) {
      shortcodes[elementShortcode] = [];
    }

    const shortcodeConfig: Shortcode = {
      pro: false,
      keywords: element?.keywords ?? "",
      component: {
        id: element.id,
        title: element.title ?? "Component",
        icon: element.icon ?? "nc-wp-shortcode-element",
        resolve: {
          type: "Wrapper",
          value: {
            _styles: ["wrapper", "wrapper--toolbar"],
            items: [
              {
                type: "ThirdParty",
                value: {
                  thirdPartyId: element.id
                }
              }
            ]
          }
        }
      }
    };

    shortcodes[elementShortcode].push(shortcodeConfig);
    const { component, ...options } = element;
    thirdPartyShortcodes[element.id] = {
      component: component,
      config: options
    };
  },

  getThirdPartyElements() {
    return thirdPartyShortcodes;
  }
};

function isValidThirdPartyConfig(component: ThirdPartyComponent): boolean {
  const componentId = component?.id;

  if (!componentId) {
    return false;
  }

  const customComponents = shortcodes["customComponent"] ?? [];

  return !customComponents.some((e) => e.component.id === componentId);
}

export default Editor;
