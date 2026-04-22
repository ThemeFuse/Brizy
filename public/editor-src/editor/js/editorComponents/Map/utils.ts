import type {
  BoxResizerPartialProps,
  Patch,
  Point
} from "visual/component/BoxResizer/types";
import { ElementModel } from "visual/component/Elements/Types";
import type { Value } from "./type";

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

export const resizerTransformPatch = (
  patch: Patch["patch"]
): Patch["patch"] => {
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

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
] satisfies Point[];

export const getBoxResizerParams = () =>
  ({
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
  }) satisfies BoxResizerPartialProps;
