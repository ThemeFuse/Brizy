import { CSSProperties } from "react";

export const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

export const previewClassName = "brz-ed-popup-two-details-preview";

export const detailsBlockClassName =
  "brz-ed-popup-two-body__content brz-ed-popup-two-blocks__grid brz-ed-popup-two-details";

const TRANSITION_DELAY = 500;
const getTransition = (height: number): number => {
  return height / TRANSITION_DELAY;
};

export const getThumbnailHeightStyle = (
  height?: string
):
  | (CSSProperties & { "--thumbnailHeight": string })
  | Record<string, unknown> => {
  if (height) {
    return {
      ["--thumbnailHeight"]: height
    };
  }
  return {};
};

export const getPreviewPointerStyle = (
  previewPointer?: string
):
  | (CSSProperties & { "--previewPointer": string })
  | Record<string, unknown> => {
  if (previewPointer) {
    return {
      ["--previewPointer"]: previewPointer
    };
  }
  return {};
};

export const getTransitionPreview = (
  thumbnailHeight?: number
):
  | (CSSProperties & { "--transitionPreview": string })
  | Record<string, unknown> => {
  if (thumbnailHeight) {
    return {
      ["--transitionPreview"]: `transform ${getTransition(
        thumbnailHeight ?? 0
      )}s linear`
    };
  }
  return {};
};
