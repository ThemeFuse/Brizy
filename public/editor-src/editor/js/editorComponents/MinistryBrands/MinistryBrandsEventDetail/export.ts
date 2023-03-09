import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($node) => {
  const node = $node.get(0);

  node.querySelectorAll<HTMLElement>(".brz-eventDetail").forEach((element) => {
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
