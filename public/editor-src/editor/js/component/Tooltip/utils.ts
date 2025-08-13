import { ElementModel } from "visual/component/Elements/Types";
import { TooltipPlacement } from "./types";

type SimpleTooltipPlacement = "top" | "bottom" | "left" | "right";

export const getTooltipPlacement = (
  placement: TooltipPlacement
): SimpleTooltipPlacement => {
  switch (placement) {
    case "top":
    case "top-start":
    case "top-end":
      return "top";
    case "bottom":
    case "bottom-start":
    case "bottom-end":
      return "bottom";
    case "left":
    case "left-start":
    case "left-end":
      return "left";
    case "right":
    case "right-start":
    case "right-end":
      return "right";
    default:
      return "top";
  }
};

export const getToolbarPlacement = (
  placement?: SimpleTooltipPlacement
): "top" | "bottom" | undefined => {
  switch (placement) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    default:
      return undefined;
  }
};

export const TOOLTIP_OUTSIDE_EXCEPTIONS = [
  ".brz-ed-toolbar",
  ".brz-ed-sidebar__right",
  ".brz-tooltip",
  ".brz-ed-tooltip__content-portal"
];

const UPDATE_TOOLTIP_KEYS = [
  "width",
  "height",
  "padding",
  "size",
  "spacing",
  "font",
  "align"
];

export const shouldUpdateTooltipByPatch = (patch: ElementModel) =>
  Object.keys(patch).some((patchKey) =>
    UPDATE_TOOLTIP_KEYS.some((key) =>
      patchKey.toLowerCase().includes(key.toLowerCase())
    )
  );
