import { match } from "fp-utilities";
import * as String from "visual/utils/string";
import * as Math from "visual/utils/math";
import * as Option from "visual/component/Options/Type";
import { FromElementModel } from "visual/component/Options/Type";
import { Value, Size } from "./Types";
import * as Patch from "./types/Patch";

export const DEFAULT_VALUE: Value = {
  src: "",
  extension: "",
  width: 0,
  height: 0,
  x: 50,
  y: 50,
  sizeType: "custom"
};

export const fromElementModel: FromElementModel<Value> = get => ({
  src: String.toString(get("imageSrc")),
  extension: String.toString(get("imageExtension")),
  width: Math.toNonNegative(get("imageWidth")),
  height: Math.toNonNegative(get("imageHeight")),
  x: Math.toNonNegative(get("positionX")),
  y: Math.toNonNegative(get("positionY")),
  sizeType: String.toString(get("sizeType")) ?? DEFAULT_VALUE.sizeType
});

export const toElementModel: Option.ToElementModel<Patch.Patch> = match(
  [
    Patch.isImageDataPatch,
    v => ({
      imageSrc: v.imageSrc,
      imageExtension: v.imageExtension,
      imageWidth: v.imageWidth,
      imageHeight: v.imageHeight
    })
  ],
  [
    Patch.isPositionPatch,
    v => ({ positionX: v.positionX, positionY: v.positionY })
  ],
  [Patch.isSizePatch, v => ({ sizeType: v.sizeType })]
);

export const configSizeToSize = (size: {
  label: string;
  name: string;
}): Size => ({
  value: size.name,
  label: size.label
});
