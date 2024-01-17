import { ElementModel } from "visual/component/Elements/Types";
import { Patch, Value } from "visual/editorComponents/Icon/types";

export const resizerPoints = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight"
];

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

export const resizerTransformPatch = (patch: Patch): Patch => {
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
