import { Num } from "@brizy/readers";
import { Placement } from "@popperjs/core";
import { makeAttr } from "visual/utils/i18n/attribute";
import { parseFromString } from "visual/utils/string";
import { setupTooltip } from "../../component/Tooltip/utils.export";
import { TooltipAttributes } from "./types";

export default function ($node: JQuery) {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  const tooltipNodes = node.querySelectorAll<HTMLElement>(
    `.brz-rich-text [${makeAttr("tooltip")}], .brz-rich-text [data-tooltip]`
  );

  if (tooltipNodes.length === 0) {
    return;
  }

  const tooltipElement = document.createElement("span");
  tooltipElement.classList.add("brz-tooltip", "brz-tooltip-rich-text");

  const tooltipText = document.createElement("span");
  tooltipText.classList.add("brz-tooltip-text");
  tooltipElement.appendChild(tooltipText);

  const tooltipArrow = document.createElement("span");
  tooltipArrow.classList.add("brz-tooltip--arrow");
  tooltipElement.appendChild(tooltipArrow);
  node.appendChild(tooltipElement);

  tooltipNodes.forEach((item) => {
    const classes = [...item.classList].filter((cls) =>
      cls.startsWith("brz-css-")
    );

    const dataTooltip =
      item.getAttribute(makeAttr("tooltip")) ??
      item.getAttribute("data-tooltip") ??
      "{}";

    const {
      tooltipOffset,
      tooltipText,
      tooltipPlacement = "top",
      tooltipTriggerClick = "hover"
    } = parseFromString<TooltipAttributes>(dataTooltip) ?? {};

    const parent = item.closest(".brz-rich-text")?.parentElement;

    if (!parent) {
      return;
    }

    parent.appendChild(tooltipElement);

    const beforeOpenTooltip = () => {
      parent.appendChild(tooltipElement);

      const tooltipContentElement =
        tooltipElement.querySelector(".brz-tooltip-text");

      if (tooltipContentElement) {
        tooltipContentElement.textContent = tooltipText ?? "";
      }

      tooltipElement.className = "brz-tooltip brz-tooltip-rich-text";
      tooltipElement.classList.add(...classes);
    };

    setupTooltip(item, tooltipElement, tooltipArrow, {
      beforeOpen: beforeOpenTooltip,
      attributes: {
        tooltipTrigger: tooltipTriggerClick,
        placement: tooltipPlacement as Placement,
        offset: Num.read(tooltipOffset) ?? 0
      }
    });
  });
}
