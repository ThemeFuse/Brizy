import React from "react";
import { DCGroup } from "visual/global/Config/types/DynamicContent";
import { Sheet } from "visual/providers/StyleProvider/Sheet";

export interface EditorComponentContextValue {
  dynamicContent: {
    itemId: string;
    config?: DCGroup<"wp"> | DCGroup<"cloud">;
  };
  sheet?: Sheet;
}

export const EditorComponentContext =
  React.createContext<EditorComponentContextValue>({
    dynamicContent: {
      itemId: "",
      config: undefined
    }
  });
