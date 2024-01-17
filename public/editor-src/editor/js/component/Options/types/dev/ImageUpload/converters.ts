import { match } from "fp-utilities";
import { FromElementModel } from "visual/component/Options/Type";
import * as Option from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/ImageUpload/Types";
import * as Patch from "visual/component/Options/types/dev/ImageUpload/types/Patch";
import * as Math from "visual/utils/math";
import * as String from "visual/utils/string";

export const defaultValue: Value = {
  src: "",
  fileName: "",
  extension: "",
  width: 0,
  height: 0,
  x: 50,
  y: 50,
  sizeType: "custom"
};

export const fromElementModel: FromElementModel<"imageUpload"> = (get) => ({
  src: String.toString(get("imageSrc")),
  fileName: String.toString(get("imageFileName")),
  extension: String.toString(get("imageExtension")),
  width: Math.toNonNegative(get("imageWidth")),
  height: Math.toNonNegative(get("imageHeight")),
  x: Math.toNonNegative(get("positionX")),
  y: Math.toNonNegative(get("positionY")),
  sizeType: String.toString(get("sizeType")) ?? defaultValue.sizeType
});

export const toElementModel: Option.ToElementModel<"imageUpload"> = match(
  [
    Patch.isImageDataPatch,
    (v) => ({
      imageSrc: v.imageSrc,
      imageFileName: v.imageFileName,
      imageExtension: v.imageExtension,
      imageWidth: v.imageWidth,
      imageHeight: v.imageHeight
    })
  ],
  [
    Patch.isPositionPatch,
    (v) => ({ positionX: v.positionX, positionY: v.positionY })
  ],
  [Patch.isSizePatch, (v) => ({ sizeType: v.sizeType })]
);
