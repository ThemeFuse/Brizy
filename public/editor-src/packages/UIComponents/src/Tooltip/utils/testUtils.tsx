import { ToolbarItemsInstance } from "../types";
import { Placement, Size } from "../types";

export const getToolbar = () =>
  ({
    toolbarRef: { current: document.createElement("div") },
    toolbarCSSPosition: "absolute",
    toolbarItemIndex: 0,
    toolbarItemsLength: 1
  } as unknown as ToolbarItemsInstance);

export const sizes: Size[] = ["auto", "small", "medium", "large", "xlarge"];
export const placements: Placement[] = [
  "auto",
  "auto-start",
  "auto-end",
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "right",
  "right-start",
  "right-end",
  "left",
  "left-start",
  "left-end"
];
export const getOffsetPosition = (placement: Omit<Placement, "auto">) => {
  switch (placement) {
    case "right-start":
    case "right-end":
    case "right":
      return "left";
    case "left-start":
    case "left-end":
    case "left":
      return "right";
    case "top-start":
    case "top-end":
    case "top":
      return "bottom";
    case "bottom-start":
    case "bottom-end":
    case "bottom":
      return "top";
  }
};
