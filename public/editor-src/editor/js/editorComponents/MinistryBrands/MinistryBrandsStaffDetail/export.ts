import { ExportFunction } from "visual/types";
import { attachMailtoLinkHandler } from "../utils.export";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  root.querySelectorAll<HTMLElement>(".brz-staffDetail").forEach((element) => {
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
    attachMailtoLinkHandler(element);
  });
};
