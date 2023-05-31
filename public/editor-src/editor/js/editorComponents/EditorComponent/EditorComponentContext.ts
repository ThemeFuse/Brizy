import React from "react";
import Cnf, { Config, isWp } from "visual/global/Config";
import { DCGroup } from "visual/global/Config/types/DynamicContent";
import * as Str from "visual/utils/reader/string";

export interface EditorComponentContextValue {
  dynamicContent: {
    itemId: string;
    config?: DCGroup<"wp"> | DCGroup<"cloud">;
  };
}

const getPageId = (config: Config): string => {
  if (isWp(config)) {
    return Str.read(config.wp.page) ?? "";
  }

  return Str.read(config.page?.id) ?? "";
};

const getConfig = (config: Config) => {
  return config.dynamicContent?.groups;
};

export const EditorComponentContext =
  React.createContext<EditorComponentContextValue>({
    dynamicContent: {
      itemId: getPageId(Cnf.getAll()),
      config: getConfig(Cnf.getAll())
    }
  });
