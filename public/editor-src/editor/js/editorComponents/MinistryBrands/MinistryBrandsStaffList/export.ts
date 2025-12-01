import { ExportFunction } from "visual/types";
import { attachMailtoLinkHandler } from "../utils.export";

export const fn: ExportFunction = ($root) => {
  const root = $root.get(0);
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>(".brz-staffList")
    .forEach(attachMailtoLinkHandler);
};
