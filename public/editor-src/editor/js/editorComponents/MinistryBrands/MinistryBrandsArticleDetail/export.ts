import { getFreeLibs } from "visual/libs";
import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($node) => {
  const node = $node.get(0);
  if (!node) return;

  const { initEkklesiaPopups } = getFreeLibs();

  if (typeof initEkklesiaPopups === "function") {
    initEkklesiaPopups(node.querySelectorAll(".brz-articleDetail"));
  }

  node
    .querySelectorAll<HTMLElement>(".brz-articleDetail")
    .forEach((element) => {
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

export default fn;
