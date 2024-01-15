import { ElementModel } from "visual/component/Elements/Types";
import { Value } from "./types/Value";

export const resizerRestrictions = {
  size: {
    px: {
      min: 8,
      max: 50
    }
  },
  tabletSize: {
    px: {
      min: 8,
      max: 50
    }
  },
  mobileSize: {
    px: {
      min: 8,
      max: 50
    }
  }
};

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
