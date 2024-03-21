import { getFreeLibs } from "visual/libs";
import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(root.querySelectorAll(".brz-articleFeatured"));
  }
};
