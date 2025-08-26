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
      setupTooltip(element, tooltip, arrow);
    }
  });
}
