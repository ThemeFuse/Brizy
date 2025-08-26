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

interface ExtraOptions {
  beforeOpen?: VoidFunction;
  attributes?: {
    tooltipTrigger?: string;
    placement?: Placement;
    offset?: number;
  };
}

export function setupTooltip(
  element: HTMLElement,
  tooltip: HTMLElement,
  arrow: HTMLElement,
  extraOptions?: ExtraOptions
) {
  const { CreatePopper } = getProLibs();

  if (!CreatePopper) {
    return;
  }

  let isVisible = false;

  const { attributes } = extraOptions ?? {};
  const { tooltipTrigger, offset, placement } = attributes ?? {};

  const offsetAttr = tooltip.getAttribute(makeAttr("tooltip-offset"));
  const offsetValue = offset ?? Num.read(offsetAttr) ?? 0;

  const _placement =
    placement ??
    (tooltip.getAttribute(makeAttr("tooltip-placement")) as Placement) ??
    "top";

  let trigger =
    tooltipTrigger ??
    tooltip.getAttribute(makeAttr("tooltip-trigger")) ??
    "hover";

  // On mobile, default to click
  const isTouchDevice = "ontouchstart" in window;
  if (isTouchDevice && trigger === "hover") {
    trigger = "click";
  }

  const popperInstance = CreatePopper(element, tooltip, {
    placement: _placement,
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

    const { beforeOpen } = extraOptions ?? {};

    if (beforeOpen) {
      beforeOpen();
    }

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
    element.addEventListener("click", stopEventPropagation);
  }
}
