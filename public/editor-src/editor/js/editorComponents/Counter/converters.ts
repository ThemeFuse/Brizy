import * as Num from "visual/utils/reader/number";
import type { TransformValue, Value } from "./types";

export const resizerTransformValue = (v: Value): TransformValue => {
  const {
    width,
    tabletWidth,
    mobileWidth,
    widthSuffix,
    tabletWidthSuffix,
    mobileWidthSuffix,
    ...rest
  } = v;

  return {
    size: width,
    tabletSize: tabletWidth,
    mobileSize: mobileWidth,
    sizeSuffix: widthSuffix,
    tabletSizeSuffix: tabletWidthSuffix,
    mobileSizeSuffix: mobileWidthSuffix,
    ...rest
  };
};

export const resizerTransformPatch = (
  patch: Partial<Value>
): Partial<Value> => {
  const size = Num.read(patch.size);
  const tabletSize = Num.read(patch.tabletSize);
  const mobileSize = Num.read(patch.mobileSize);

  if (size) {
    patch.width = size;
    delete patch.size;
  }

  if (tabletSize) {
    patch.tabletWidth = tabletSize;
    delete patch.tabletSize;
  }

  if (mobileSize) {
    patch.mobileWidth = mobileSize;
    delete patch.mobileSize;
  }

  return patch;
};
