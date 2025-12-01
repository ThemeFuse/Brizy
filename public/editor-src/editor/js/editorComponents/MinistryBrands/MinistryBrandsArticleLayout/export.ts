import { getFreeLibs } from "visual/libs";
import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(root.querySelectorAll(".brz-articleLayout"));
  }

  root.querySelectorAll<HTMLElement>(".brz-articleLayout").forEach((item) => {
    const selects = item.querySelectorAll("select");

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        item
          .querySelector<HTMLFormElement>("#brz-articleLayout__form")
          ?.submit();
      });
    });
  });
};
