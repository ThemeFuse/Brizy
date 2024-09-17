import {
  CropData,
  Data as ImageBaseData,
  ImagePatterns,
  OthersSizeType,
  SizeType
} from "visual/global/Config/types/configs/common";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

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

interface BaseImageData {
  baseUrl: string;
  fileName: string;
  uid?: string;
  sizeType?: string;
  crop?: CropData;
}

export interface ResizeData extends BaseImageData {
  pattern: string;
}

export interface DataUrl extends BaseImageData {
  patterns: ImagePatterns;
}

export interface PlaceholdersValues
  extends Omit<CropData, "iW" | "iH">,
    Record<string, MValue<Literal>> {
  baseUrl: string;
  fileName: string;
  uid?: string;
  sizeType?: string;
  iW?: number;
  iH?: number | "any";
}

export enum ImageType {
  Internal = "internal",
  External = "external",
  Unsplash = "unsplash"
}
