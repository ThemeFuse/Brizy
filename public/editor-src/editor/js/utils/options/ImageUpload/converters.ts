import { match, or } from "fp-utilities";
import type * as Option from "visual/component/Options/Type";
import type { FromElementModel } from "visual/component/Options/Type";
import type { Value } from "visual/component/Options/types/dev/ImageUpload/Types";
import { always, pipe } from "visual/utils/fp";
import { ImageType } from "visual/utils/image/types";
import { toNonNegative } from "visual/utils/math";
import { readImageType } from "visual/utils/options/ImageUpload/utils";
import { read as readStr } from "visual/utils/reader/string";
import * as Str from "visual/utils/string";
import * as Patch from "./Patch";

export const defaultValue: Value = {
  src: "",
  fileName: "",
  extension: "",
  width: 0,
  height: 0,
  x: 50,
  y: 50,
  sizeType: "custom",
  imageType: ImageType.Internal,
  altTitle: ""
};

export const fromElementModel: FromElementModel<"imageUpload"> = (get) => ({
  src: Str.asString(get("imageSrc"), defaultValue.src),
  fileName: Str.asString(get("imageFileName"), defaultValue.fileName),
  extension: Str.asString(get("imageExtension"), defaultValue.extension),
  width: toNonNegative(get("imageWidth"), defaultValue.width),
  height: toNonNegative(get("imageHeight"), defaultValue.height),
  x: toNonNegative(get("positionX"), defaultValue.x),
  y: toNonNegative(get("positionY"), defaultValue.y),
  sizeType: Str.asString(get("sizeType"), defaultValue.sizeType),
  alt: Str.asString(get("altTitle"), defaultValue.altTitle),
  imageType: or(
    pipe(() => get("imageType"), readStr, readImageType),
    always(defaultValue.imageType)
  )()
});

export const toElementModel: Option.ToElementModel<"imageUpload"> = match(
  [
    Patch.isImageDataPatch,
    (v) => ({
      imageSrc: v.src,
      imageFileName: v.fileName,
      imageExtension: v.extension,
      imageWidth: v.width,
      imageHeight: v.height,
      imageType: ImageType.Internal,
      alt: v.alt
    })
  ],
  [Patch.isPositionPatch, (v) => ({ positionX: v.x, positionY: v.y })],
  [Patch.isSizePatch, (v) => ({ sizeType: v.sizeType })]
);
