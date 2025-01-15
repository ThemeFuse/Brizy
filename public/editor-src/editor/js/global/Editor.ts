import { ComponentType } from "react";
import type { EditorInstance as EditorComponent } from "visual/editorComponents/EditorComponent";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  ThirdPartyComponent,
  ThirdPartyConfig
} from "visual/global/Config/types/configs/ThirdParty";
import { getFlatShortcodes } from "visual/shortcodeComponents/utils";

const components: Record<string, EditorComponent | null> = {};
let notFoundComponent: undefined | EditorComponent;
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

  registerThirdPartyElement(
    element: ThirdPartyComponent,
    config: ConfigCommon
  ): void {
    const validConfig = isValidThirdPartyConfig(element, config);

    if (!validConfig) {
      console.error("Invalid third party element config");
      return;
    }

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

function isValidThirdPartyConfig(
  component: ThirdPartyComponent,
  config: ConfigCommon
): boolean {
  const componentId = component?.id;

  if (!componentId) {
    return false;
  }

  const shortcodes = getFlatShortcodes(config);

  return Object.values(shortcodes)
    .flat()
    .some((e) => e.component.id === componentId);
}

export default Editor;
