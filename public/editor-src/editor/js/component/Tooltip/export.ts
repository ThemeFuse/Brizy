import { makeAttr } from "visual/utils/i18n/attribute";
import { setupTooltip } from "./utils.export";

export default function ($node: JQuery) {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  node.querySelectorAll<HTMLElement>(".brz-tooltip").forEach((tooltip) => {
    const arrow = tooltip.querySelector<HTMLElement>(".brz-tooltip--arrow");
    const elementId = tooltip.getAttribute(makeAttr("element-id"));
    const selector = `[${makeAttr("tooltip-wrapper-id")}=${elementId}]`;

    const parentElement = tooltip.parentElement;

    if (!parentElement) {
      return;
    }

    const element = parentElement.querySelector<HTMLElement>(selector);

    if (tooltip && arrow && element) {
      // Ensure tooltip has an ID and is referenced from the trigger for screen readers
      if (!tooltip.id) {
        tooltip.id = `brz-tooltip-${elementId ?? ""}`.trim();
      }

      const describedBy = element.getAttribute("aria-describedby") ?? "";
      const ids = new Set(
        describedBy
          .split(" ")
          .map((v) => v.trim())
          .filter(Boolean)
      );
      ids.add(tooltip.id);
      element.setAttribute("aria-describedby", Array.from(ids).join(" "));

      setupTooltip(element, tooltip, arrow);
    }
  });
}
