import type { ExportFunction } from "visual/types";
import { attachMailtoLinkHandler } from "../utils.export";

export const fn: ExportFunction = (root) => {
  root
    .querySelectorAll<HTMLElement>(".brz-staffList")
    .forEach(attachMailtoLinkHandler);
};
