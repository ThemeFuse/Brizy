import type { Patch, Point } from "visual/component/BoxResizer/types";
import { ElementModel } from "visual/component/Elements/Types";
import { Value } from "visual/editorComponents/Icon/types";

export const resizerPoints = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight"
] satisfies Point[];

export const resizerTransformValue = (v: Value): ElementModel => {
  const {
    customSize,
    tabletCustomSize,
    mobileCustomSize,
    customSizeSuffix,
    tabletCustomSizeSuffix,
    mobileCustomSizeSuffix,
    ...rest
  } = v;

  return {
    ...rest,
    size: customSize,
    tabletSize: tabletCustomSize,
    mobileSize: mobileCustomSize,
    sizeSuffix: customSizeSuffix,
    tabletSizeSuffix: tabletCustomSizeSuffix,
    mobileSizeSuffix: mobileCustomSizeSuffix
  };
};

interface DevicesCustomSize {
  customSize?: number;
  tabletCustomSize?: number;
  mobileCustomSize?: number;
}

export const resizerTransformPatch = (
  patch: Patch<DevicesCustomSize>["patch"]
): Patch<DevicesCustomSize>["patch"] => {
  let newPatch = patch;

  if ("size" in patch) {
    const { size, ..._patch } = patch;
    newPatch = { ..._patch, customSize: size };
  }

  if ("tabletSize" in patch) {
    const { tabletSize, ..._patch } = patch;
    newPatch = { ..._patch, tabletCustomSize: tabletSize };
  }

  if ("mobileSize" in patch) {
    const { mobileSize, ..._patch } = patch;
    newPatch = { ..._patch, mobileCustomSize: mobileSize };
  }

  return newPatch;
};
