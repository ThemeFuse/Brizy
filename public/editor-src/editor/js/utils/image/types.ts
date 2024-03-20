import {
  CropData,
  Data as ImageBaseData,
  OthersSizeType,
  SizeType
} from "visual/global/Config/types/configs/common";

export interface CustomSize extends ImageBaseData {
  sizeType: SizeType.custom;
  crop?: CropData;
}

export interface OriginalSize extends ImageBaseData {
  sizeType: SizeType.original;
}

export interface OthersSize extends ImageBaseData {
  sizeType: OthersSizeType;
}

export type Data = CustomSize | OriginalSize | OthersSize;

export interface BaseOptions {
  fileName?: string;
}

export interface FilterOption extends BaseOptions {
  iW?: number;
  iH?: "any" | number;
}

export enum ImageType {
  Internal = "internal",
  External = "external"
}
