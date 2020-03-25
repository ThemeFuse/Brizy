import * as String from "visual/utils/string";
import * as Math from "visual/utils/math";
import * as Patcher from "visual/utils/patch";
import * as Model from "./model";
import { MValue, onUndefined } from "visual/utils/value";
import { GetModel } from "visual/component/Options/Type";
import { PositionPatch, ImageDataPatch, Value } from "./Types";
import { apply } from "visual/utils/model";

export const getModel: GetModel<Value> = get => ({
  src: String.toString(get("imageSrc")) || "",
  extension: String.toString(get("imageExtension")) || "",
  width: onUndefined(Math.toNonNegative(get("imageWidth")), 0),
  height: onUndefined(Math.toNonNegative(get("imageHeight")), 0),
  x: onUndefined(Math.toNonNegative(get("positionX")), 50),
  y: onUndefined(Math.toNonNegative(get("positionY")), 50)
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
