import type { ComponentType } from "react";
import type { EditorInstance as EditorComponent } from "visual/editorComponents/EditorComponent";
import type {
  ThirdPartyComponent,
  ThirdPartyConfig
} from "visual/global/Config/types/configs/ThirdParty";

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

  registerThirdPartyElement(element: ThirdPartyComponent): void {
    const { id } = element;

    if (!id || components[id]) {
      console.error("Invalid third party element config");
      return;
    }

    if (thirdPartyShortcodes[id]) {
      console.warn("Already registered third-party element config", id);
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

export default Editor;
