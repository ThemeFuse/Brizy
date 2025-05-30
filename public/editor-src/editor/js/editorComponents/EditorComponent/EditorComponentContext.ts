import React from "react";
import { DCGroup } from "visual/global/Config/types/DynamicContent";
import { Sheet } from "visual/providers/StyleProvider/Sheet";

export interface EditorComponentContextValue {
  dynamicContent: {
    itemId: string;
    config?: DCGroup<"wp"> | DCGroup<"cloud">;
  };
  sheet: Readonly<Sheet>;
}

export const EditorComponentContext =
  React.createContext<EditorComponentContextValue>({
    sheet: new Sheet(),
    dynamicContent: {
      itemId: "",
      config: undefined
    }
  });
