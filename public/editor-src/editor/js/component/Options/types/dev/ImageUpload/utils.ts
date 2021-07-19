import * as String from "visual/utils/string";
import * as Math from "visual/utils/math";
import * as Patcher from "visual/utils/patch";
import * as Model from "./model";
import * as Option from "visual/component/Options/Type";
import { MValue } from "visual/utils/value";
import { GetModel } from "visual/component/Options/Type";

import { PositionPatch, ImageDataPatch, Value } from "./Types";
import { apply } from "visual/utils/model";

export const DEFAULT_VALUE = {
  src: "",
  extension: "",
  width: 0,
  height: 0,
  x: 50,
  y: 50
};

export const getModel: GetModel<Value> = get => ({
  src: String.toString(get("imageSrc")),
  extension: String.toString(get("imageExtension")),
  width: Math.toNonNegative(get("imageWidth")),
  height: Math.toNonNegative(get("imageHeight")),
  x: Math.toNonNegative(get("positionX")),
  y: Math.toNonNegative(get("positionY"))
});

export const getElementModel: Option.GetElementModel<Value> = (v, get) => ({
  [get("imageSrc")]: v.src,
  [get("imageExtension")]: v.extension,
  [get("imageWidth")]: v.width,
  [get("imageHeight")]: v.height,
  [get("positionX")]: v.x,
  [get("positionY")]: v.y
});

export const patchImageData = (
  newModel: Model.Image,
  oldModel: Model.Image
): MValue<ImageDataPatch> => {
  const patch = Patcher.apply(
    [
      [Model.setSrc, newModel.src],
      [Model.setExtension, newModel.extension],
      [Model.setWidth, newModel.width],
      [Model.setHeight, newModel.height]
    ],
    oldModel
  );

  return patch
    ? {
        imageSrc: patch.src,
        imageExtension: patch.extension,
        imageWidth: patch.width,
        imageHeight: patch.height
      }
    : undefined;
};

export const patchPosition = (
  newModel: Model.Image,
  oldModel: Model.Image
): MValue<PositionPatch> => {
  const patch = apply(
    [
      [Model.setX, newModel.x],
      [Model.setY, newModel.y]
    ],
    oldModel
  );

  return patch
    ? {
        positionX: patch.x,
        positionY: patch.y
      }
    : undefined;
};
