import { ExportFunction } from "visual/types";
import { addContentEventListener } from "./utils";

export const fn: ExportFunction = ($node) => {
  const root = $node.get(0);
  if (!root) return;

  root.querySelectorAll<HTMLElement>(".brz-eventLayout").forEach((item) => {
    const selects = item.querySelectorAll(
      ".brz-eventLayout--filters-form select"
    );

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        item
          .querySelector<HTMLFormElement>("#brz-eventLayout--filters-form")
          ?.submit();
      });
    });

    const eventListWrapper = item.querySelector<HTMLElement>(
      ".brz-eventLayout--list"
    );
    if (eventListWrapper) {
      addContentEventListener({ type: "list", wrapper: eventListWrapper });
    }

    const calendarWrapper = item.querySelector<HTMLElement>(
      ".brz-eventLayout--calendar"
    );
    if (calendarWrapper) {
      addContentEventListener({ type: "calendar", wrapper: calendarWrapper });
    }
  });
};
