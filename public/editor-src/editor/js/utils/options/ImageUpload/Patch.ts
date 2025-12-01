// region ImagePatch
import { ImageType } from "visual/utils/image/types";

export type ImageDataPatch = {
  src: string;
  fileName: string;
  extension: string;
  width: number;
  height: number;
  imageType: ImageType;
  alt?: string;
};

export const isImageDataPatch = (p: Patch): p is ImageDataPatch => "src" in p;
// endregion

// region PositionPatch
export type PositionPatch = {
  x: number;
  y: number;
};

export const isPositionPatch = (p: Patch): p is PositionPatch => "x" in p;
// endregion

// region SizePatch
export type SizePatch = {
  sizeType: string;
};

export const isSizePatch = (p: Patch): p is SizePatch => "sizeType" in p;
// endregion

export type Patch = ImageDataPatch | PositionPatch | SizePatch;
