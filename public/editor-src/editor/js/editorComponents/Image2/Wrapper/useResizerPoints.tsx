import { ImageProps } from "../types";

import { isSVG, isGIF } from "../utils";

const POINTS = {
  default: [
    "topLeft",
    "topCenter",
    "topRight",
    "centerLeft",
    "centerRight",
    "bottomLeft",
    "bottomCenter",
    "bottomRight"
  ],
  gallery: ["bottomCenter"],
  svg: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
  gif: ["topLeft", "topRight", "bottomLeft", "bottomRight"]
};

type RestrictionInterval = {
  px: {
    min: number;
    max: number;
  };
  "%": {
    min: number;
    max: number;
  };
};

type UseResizerPoints = (
  props: ImageProps
) => {
  points:
    | typeof POINTS.default
    | typeof POINTS.gallery
    | typeof POINTS.svg
    | typeof POINTS.gif;
  restrictions: {
    height: RestrictionInterval;
    width: RestrictionInterval;
    tabletWidth: RestrictionInterval;
    mobileWidth: RestrictionInterval;
  };
};

const useResizerPoints: UseResizerPoints = ({ v, meta }) => {
  const { gallery, desktopW, tabletW, mobileW } = meta;
  const { imageExtension } = v;

  let points = POINTS.default;
  if (gallery && gallery.inGallery) {
    points = POINTS.gallery;
  } else if (isSVG(imageExtension)) {
    points = POINTS.svg;
  } else if (isGIF(imageExtension)) {
    points = POINTS.gif;
  }

  const restrictions = {
    height: {
      px: {
        min: 5,
        max: Infinity
      },
      "%": {
        min: 5,
        max: Infinity
      }
    },
    width: {
      px: {
        min: 5,
        max: desktopW
      },
      "%": {
        min: 5,
        max: 100
      }
    },
    tabletWidth: {
      px: {
        min: 5,
        max: tabletW
      },
      "%": {
        min: 5,
        max: 100
      }
    },
    mobileWidth: {
      px: {
        min: 5,
        max: mobileW
      },
      "%": {
        min: 5,
        max: 100
      }
    }
  };

  return { points, restrictions };
};

export default useResizerPoints;
