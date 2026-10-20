import { getFreeLibs } from "visual/libs";
import type { ExportFunction } from "visual/types";

export const fn: ExportFunction = (root) => {
  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(root.querySelectorAll(".brz-articleList"));
  }
};
