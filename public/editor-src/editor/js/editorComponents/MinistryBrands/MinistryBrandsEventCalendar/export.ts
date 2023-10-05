import { ExportFunction } from "visual/types";
import { addContentEventListener } from "./utils";

export const fn: ExportFunction = ($node) => {
  const root = $node.get(0);
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>(
      ".brz-eventCalendar .brz-eventCalendar-layout"
    )
    .forEach((item) => {
      addContentEventListener({ wrapper: item });
    });
};
