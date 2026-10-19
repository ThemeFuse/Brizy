import { getFreeLibs } from "visual/libs";
import type { ExportFunction } from "visual/types";

export const fn: ExportFunction = (root) => {
  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(root.querySelectorAll(".brz-sermonLayout"));
  }

  root.querySelectorAll<HTMLElement>(".brz-sermonLayout").forEach((item) => {
    const selects = item.querySelectorAll("select");

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        item
          .querySelector<HTMLFormElement>("#brz-sermonLayout__filter--form")
          ?.submit();
      });
    });
  });
};
