import { match, or } from "fp-utilities";
import * as Option from "visual/component/Options/Type";
import { FromElementModel } from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/ImageUpload/Types";
import * as Patch from "visual/component/Options/types/dev/ImageUpload/types/Patch";
import { always, pipe } from "visual/utils/fp";
import { ImageType } from "visual/utils/image/types";
import * as Math from "visual/utils/math";
import { readImageType } from "visual/utils/options/ImageUpload/utils";
import { read as readStr } from "visual/utils/reader/string";
import * as String from "visual/utils/string";

export const defaultValue: Value = {
  src: "",
  fileName: "",
  extension: "",
  width: 0,
  height: 0,
  x: 50,
  y: 50,
  sizeType: "custom",
  imageType: ImageType.Internal
};

export const fromElementModel: FromElementModel<"imageUpload"> = (get) => ({
  src: String.toString(get("imageSrc"), defaultValue.src),
  fileName: String.toString(get("imageFileName"), defaultValue.fileName),
  extension: String.toString(get("imageExtension"), defaultValue.extension),
  width: Math.toNonNegative(get("imageWidth"), defaultValue.width),
  height: Math.toNonNegative(get("imageHeight"), defaultValue.height),
  x: Math.toNonNegative(get("positionX"), defaultValue.x),
  y: Math.toNonNegative(get("positionY"), defaultValue.y),
  sizeType: String.toString(get("sizeType"), defaultValue.sizeType),
  imageType: or(
    pipe(() => get("imageType"), readStr, readImageType),
    always(defaultValue.imageType)
  )()
});

export const toElementModel: Option.ToElementModel<"imageUpload"> = match(
  [
    Patch.isImageDataPatch,
    (v) => ({
      imageSrc: v.imageSrc,
      imageFileName: v.imageFileName,
      imageExtension: v.imageExtension,
      imageWidth: v.imageWidth,
      imageHeight: v.imageHeight,
      imageType: ImageType.Internal
    })
  ],
  [
    Patch.isPositionPatch,
    (v) => ({ positionX: v.positionX, positionY: v.positionY })
  ],
  [Patch.isSizePatch, (v) => ({ sizeType: v.sizeType })]
);
