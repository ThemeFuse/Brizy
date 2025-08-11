import { Num } from "@brizy/readers";
import { Placement, Instance as PopperInstance } from "@popperjs/core";
import { getProLibs } from "visual/libs";
import { makeAttr } from "visual/utils/i18n/attribute";

function stopEventPropagation(e: Event) {
  e.stopPropagation();
}

function enablePopperListeners(
  popperInstance: PopperInstance,
  enabled: boolean
) {
  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...(options.modifiers ?? []),
      { name: "eventListeners", enabled }
    ]
  }));
}

function show(tooltip: HTMLElement, popperInstance: PopperInstance) {
  if (!tooltip.hasAttribute("data-show")) {
    tooltip.setAttribute("data-show", "");
    enablePopperListeners(popperInstance, true);
    popperInstance.update();
  }
}

function hide(tooltip: HTMLElement, popperInstance: PopperInstance) {
  if (tooltip.hasAttribute("data-show")) {
    tooltip.removeAttribute("data-show");
    enablePopperListeners(popperInstance, false);
  }
}

function setupTooltip(
  element: HTMLElement,
  tooltip: HTMLElement,
  arrow: HTMLElement
) {
  const { CreatePopper } = getProLibs();

  if (!CreatePopper) {
    return;
  }

  let isVisible = false;

  const offsetAttr = tooltip.getAttribute(makeAttr("tooltip-offset"));
  const offsetValue = Num.read(offsetAttr) ?? 0;

  const placement =
    (tooltip.getAttribute(makeAttr("tooltip-placement")) as Placement) ?? "top";

  let trigger = tooltip.getAttribute(makeAttr("tooltip-trigger")) ?? "hover";

  // On mobile, default to click
  const isTouchDevice = "ontouchstart" in window;
  if (isTouchDevice && trigger === "hover") {
    trigger = "click";
  }

  const popperInstance = CreatePopper(element, tooltip, {
    placement,
    modifiers: [
      {
        name: "arrow",
        options: { element: arrow }
      },
      {
        name: "preventOverflow",
        options: { boundary: "viewport" }
      },
      {
        name: "offset",
        options: { offset: [0, offsetValue] }
      }
    ]
  });

  function handleShow() {
    if (!tooltip) return;

    show(tooltip, popperInstance);
    isVisible = true;
  }

  function handleHide() {
    if (!tooltip) return;

    hide(tooltip, popperInstance);
    isVisible = false;
  }

  function toggle() {
    isVisible ? handleHide() : handleShow();
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      !element.contains(e.target as Node) &&
      tooltip &&
      !tooltip.contains(e.target as Node)
    ) {
      handleHide();
    }
  }

  // Add event listeners based on trigger
  if (trigger === "hover") {
    element.addEventListener("mouseenter", handleShow);
    element.addEventListener("mouseleave", handleHide);
  } else if (trigger === "click") {
    element.addEventListener("click", toggle);
    document.addEventListener("click", handleClickOutside);
    // Prevent the tooltip from closing when clicking inside it
    tooltip.addEventListener("click", stopEventPropagation);
  }
}

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
