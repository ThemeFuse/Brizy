import { ExportFunction } from "visual/types";

export const fn: ExportFunction = ($node) => {
  const root = $node.get(0);
  if (!root) return;

  root.querySelectorAll<HTMLElement>(".brz-groupLayout").forEach((item) => {
    const selects = item.querySelectorAll("select");

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        item
          .querySelector<HTMLFormElement>("#brz-groupLayout__filters--form")
          ?.submit();
      });
    });
  });
};
