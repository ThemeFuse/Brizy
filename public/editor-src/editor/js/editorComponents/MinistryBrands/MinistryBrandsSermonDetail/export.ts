import { getFreeLibs } from "visual/libs";
import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(root.querySelectorAll(".brz-sermonDetail"));
  }

  root.querySelectorAll<HTMLElement>(".brz-sermonDetail").forEach((element) => {
    element.addEventListener("click", (e) => {
      const element = e.target;

      if (
        element instanceof HTMLElement &&
        element.classList.contains(
          "brz-ministryBrands__item--meta--links--previous"
        )
      ) {
        // will not work if it does not have any previous URL to go to.
        history.back();
      }
    });
  });
};
