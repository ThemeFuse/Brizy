import { ExportFunction } from "visual/types";
import { attachMailtoLinkHandler } from "../utils.export";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  root.querySelectorAll<HTMLElement>(".brz-staffLayout").forEach((item) => {
    const selects = item.querySelectorAll("select");

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        item
          .querySelector<HTMLFormElement>("#brz-staffLayout__filters--form")
          ?.submit();
      });
    });

    attachMailtoLinkHandler(item);
  });
};
