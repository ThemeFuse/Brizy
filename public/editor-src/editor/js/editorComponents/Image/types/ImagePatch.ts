import { Obj } from "@brizy/readers";
import { mPipe, optional } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { DeviceMode } from "visual/types";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import { defaultValueKey } from "visual/utils/onChange";
import { LinkDCPatch } from "visual/utils/patch/Link/linkPatch";
import { readWithParser } from "visual/utils/reader/readWithParser";
import * as Str from "visual/utils/string/specs";
import { MValue } from "visual/utils/value";
import { Unit } from "../types";

export interface ImagePatch {
  imageExtension: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  alt?: string;
}

export interface HoverImagePatch {
  hoverImageExtension: string;
  hoverImageHeight: number;
  hoverImageSrc: string;
  hoverImageWidth: number;
}

export interface ImageDCPatch {
  imagePopulation: string;
}

export interface HoverImageDCPatch {
  hoverImagePopulation: string;
}

export interface SizeTypePatch {
  sizeType: string;
}

export interface UnitPatch {
  [k: string]: unknown;
  widthSuffix?: Unit;
  heightSuffix?: Unit;
  tabletWidthSuffix?: Unit;
  tabletHeightSuffix?: Unit;
  mobileWidthSuffix?: Unit;
  mobileHeightSuffix?: Unit;
}

// is it correct fn name?
interface FromImageElementModel extends ElementModel {
  imageSrc: unknown | undefined;
  imageExtension: unknown | undefined;
  imageHeight: unknown | undefined;
  imageWidth: unknown | undefined;
  alt?: unknown | undefined;
}

interface FromHoverImageElementModel extends ElementModel {
  hoverImageSrc: MValue<unknown>;
  hoverImageExtension: MValue<unknown>;
  hoverImageHeight: MValue<unknown>;
  hoverImageWidth: MValue<unknown>;
}

export type Patch =
  | ImagePatch
  | HoverImagePatch
  | HoverImageDCPatch
  | ImageDCPatch
  | SizeTypePatch
  | UnitPatch
  | LinkDCPatch;

export const isImagePatch = (v: Patch): v is ImagePatch =>
  Obj.isObject(v) &&
  Obj.hasKeys(["imageExtension", "imageHeight", "imageSrc", "imageWidth"], v);

export const isHoverImagePatch = (v: Patch): v is HoverImagePatch =>
  Obj.isObject(v) &&
  Obj.hasKeys(
    [
      "hoverImageSrc",
      "hoverImageExtension",
      "hoverImageHeight",
      "hoverImageWidth"
    ],
    v
  );

export const isDCImagePatch = (v: Patch): v is ImageDCPatch =>
  "imagePopulation" in v && typeof v.imagePopulation === "string";

export const isSizeTypePatch = (v: Patch): v is SizeTypePatch =>
  "sizeType" in v && typeof v.sizeType === "string";

export const isLinkDcPatch = (v: Patch): v is LinkDCPatch =>
  "linkPopulation" in v && typeof v.linkPopulation === "string";

export const fromImageElementModel = readWithParser<
  FromImageElementModel,
  ImagePatch
>({
  imageSrc: mPipe(prop("imageSrc"), Str.read),
  imageExtension: mPipe(prop("imageExtension"), Str.read),
  imageHeight: mPipe(prop("imageHeight"), Num.read),
  imageWidth: mPipe(prop("imageWidth"), Num.read),
  alt: optional(mPipe(Obj.readKey("alt"), Str.read))
});

export const fromHoverImageElementModel = readWithParser<
  FromHoverImageElementModel,
  HoverImagePatch
>({
  hoverImageSrc: mPipe(prop("hoverImageSrc"), Str.read),
  hoverImageExtension: mPipe(prop("hoverImageExtension"), Str.read),
  hoverImageHeight: mPipe(prop("hoverImageHeight"), Num.read),
  hoverImageWidth: mPipe(prop("hoverImageWidth"), Num.read)
});

interface FromImageDCElementModel extends ElementModel {
  imagePopulation: unknown | undefined;
}

export const fromImageDCElementModel = readWithParser<
  FromImageDCElementModel,
  ImageDCPatch
>({
  imagePopulation: mPipe(prop("imagePopulation"), Str.read)
});

interface PatchImageSizeType extends ElementModel {
  sizeType: unknown | undefined;
}

export const patchImageSizeType = readWithParser<
  PatchImageSizeType,
  SizeTypePatch
>({
  sizeType: mPipe(prop("sizeType"), Str.read)
});

export const patchImageUnit = (
  patch: ElementModel,
  device: DeviceMode
): UnitPatch | undefined => {
  if (patch) {
    const dvk = (key: string): string =>
      defaultValueKey({ key, device, state: "normal" });
    const [patchKey] = Object.keys(patch).filter(
      (key) => key === dvk("widthSuffix") || key === dvk("heightSuffix")
    );

    return patchKey ? patch : undefined;
  }

  return undefined;
};
