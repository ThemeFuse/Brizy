// region ImagePatch
export type ImageDataPatch = {
  imageSrc: string;
  imageFileName: string;
  imageExtension: string;
  imageWidth: number;
  imageHeight: number;
};

export const isImageDataPatch = (p: Patch): p is ImageDataPatch =>
  "imageSrc" in p;
// endregion

// region PositionPatch
export type PositionPatch = {
  positionX: number;
  positionY: number;
};

export const isPositionPatch = (p: Patch): p is PositionPatch =>
  "positionX" in p;
// endregion

// region SizePatch
export type SizePatch = {
  sizeType: string;
};

export const isSizePatch = (p: Patch): p is SizePatch => "sizeType" in p;
// endregion

export type Patch = ImageDataPatch | PositionPatch | SizePatch;
