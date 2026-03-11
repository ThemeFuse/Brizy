import React from "react";
import { DCGroup } from "visual/global/Config/types/DynamicContent";
import { ComponentTypes } from "visual/providers/EditorComponentProvider/ComponentTypes";
import { Sheet } from "visual/providers/StyleProvider/Sheet";

export interface EditorComponentContextValue {
  dynamicContent: {
    itemId: string;
    config?: DCGroup<"wp"> | DCGroup<"cloud">;
  };
  sheet: Readonly<Sheet>;
  componentTypes: Readonly<ComponentTypes>;
}

export const EditorComponentContext =
  React.createContext<EditorComponentContextValue>({
    sheet: new Sheet(),
    componentTypes: new ComponentTypes(),
    dynamicContent: {
      itemId: "",
      config: undefined
    }
  });
