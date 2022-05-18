import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { ImageProps } from "../types";

import { isSVG, isGIF, showOriginalImage } from "../utils";
import { SizeRestriction, WidthHeightRestriction } from "./type";
import { getSizeRestriction, getWidthRestriction } from "./utils";

const resize = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

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
  svg: resize,
  originalImage: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
  gif: resize,
  sizeType: resize,
  population: resize
};

interface ResizerCustomSize {
  points:
    | typeof POINTS.default
    | typeof POINTS.gallery
    | typeof POINTS.svg
    | typeof POINTS.gif;
  restrictions: WidthHeightRestriction;
}

interface ResizerPredefinedSize {
  points: typeof POINTS.sizeType;
  restrictions: SizeRestriction;
}

type UseResizerPoints = (
  props: ImageProps
) => ResizerCustomSize | ResizerPredefinedSize;

const useResizerPoints: UseResizerPoints = ({ v, meta }) => {
  const { sizeType, imagePopulation } = v;
  const placeholderData = placeholderObjFromStr(imagePopulation);

  if (placeholderData) {
    if (
      placeholderData.attr === undefined ||
      placeholderData.attr?.size === undefined
    ) {
      return {
        points: POINTS.default,
        restrictions: getWidthRestriction(meta, false)
      };
    }
    return {
      points: POINTS.population,
      restrictions: getSizeRestriction()
    };
  }

  if (sizeType === "custom") {
    const { imageExtension, elementPosition } = v;
    const { gallery } = meta;
    const isAbsoluteOrFixed =
      elementPosition === "absolute" || elementPosition === "fixed";
    let points = POINTS.default;

    if (gallery && gallery.inGallery) {
      points = POINTS.gallery;
    } else if (isSVG(imageExtension)) {
      points = POINTS.svg;
    } else if (isGIF(imageExtension)) {
      points = POINTS.gif;
    } else if (showOriginalImage(v)) {
    points = POINTS.originalImage;
  }

    return {
      points: points,
      restrictions: getWidthRestriction(meta, isAbsoluteOrFixed)
    };
  }

  return {
    points: POINTS.sizeType,
    restrictions: getSizeRestriction()
  };
};

export default useResizerPoints;
