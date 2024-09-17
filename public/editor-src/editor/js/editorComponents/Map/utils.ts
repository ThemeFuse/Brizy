import { ElementModel } from "visual/component/Elements/Types";
import { Value, Patch, BoxResizerParams } from "./type";

export const resizerTransformValue = (v: Value): ElementModel => {
  const {
    size,
    tabletSize,
    mobileSize,
    sizeSuffix,
    tabletSizeSuffix,
    mobileSizeSuffix,
    ...rest
  } = v;

  return {
    width: size,
    tabletWidth: tabletSize,
    mobileWidth: mobileSize,
    widthSuffix: sizeSuffix,
    tabletWidthSuffix: tabletSizeSuffix,
    mobileWidthSuffix: mobileSizeSuffix,
    ...rest
  };
};

export const resizerTransformPatch = (patch: Patch): Patch => {
  if (patch.width) {
    patch.size = patch.width;
    delete patch.width;
  }

  if (patch.tabletWidth) {
    patch.tabletSize = patch.tabletWidth;
    delete patch.tabletWidth;
  }

  if (patch.mobileWidth) {
    patch.mobileSize = patch.mobileWidth;
    delete patch.mobileWidth;
  }

  return patch;
};

export const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

export const getBoxResizerParams: BoxResizerParams = () => ({
  points: resizerPoints,
  restrictions: {
    height: {
      px: { min: 25, max: Infinity },
      "%": { min: 5, max: 100 }
    },
    width: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    tabletHeight: {
      px: { min: 25, max: Infinity },
      "%": { min: 5, max: 100 }
    },
    tabletWidth: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    },
    mobileHeight: {
      px: { min: 25, max: Infinity },
      "%": { min: 5, max: 100 }
    },
    mobileWidth: {
      px: { min: 5, max: 1000 },
      "%": { min: 5, max: 100 }
    }
  }
});
