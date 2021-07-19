import React from "react";
import Config from "visual/global/Config";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import * as Str from "visual/utils/reader/string";

export interface EditorComponentContextValue {
  dynamicContent: {
    itemId: string;
    config: DynamicContent<"wp"> | DynamicContent<"cloud">;
  };
}

const getPageId = (): string => {
  if (TARGET === "WP") {
    return Str.read(Config.get("wp").page) ?? "";
  }

  return Str.read(Config.get("page")?.id) ?? "";
};

export const EditorComponentContext = React.createContext<
  EditorComponentContextValue
>({
  dynamicContent: {
    itemId: getPageId(),
    config: Config.get("dynamicContent")
  }
});
