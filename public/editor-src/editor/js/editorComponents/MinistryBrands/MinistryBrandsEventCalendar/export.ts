import type { ExportFunction } from "visual/types";
import { addContentEventListener } from "./utils";

export const fn: ExportFunction = (root) => {
  root
    .querySelectorAll<HTMLElement>(
      ".brz-eventCalendar .brz-eventCalendar-layout"
    )
    .forEach((item) => {
      addContentEventListener({ wrapper: item });
    });
};
