import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { UploadedFont, VariationFont } from "visual/types/Fonts";

export interface FontFile {
  [type: string]: {
    [fileType: string]: File | null;
  };
}

export interface UploadFont {
  brizyId: string;
  type: "uploaded";
  family: string;
  files: FontFile;
  id: string;
  weights: string[];
  variations?: VariationFont[];
}

export interface CreateFont {
  id: string;
  name: string;
  files: FontFile;
  config: ConfigCommon;
}

interface Font extends UploadedFont {
  uid?: string;
}
export interface Response {
  data: Font;
}

interface Range {
  min: number;
  max: number;
}

export enum VariationAxesTags {
  WGHT = "wght",
  WDTH = "wdth",
  SOFT = "SOFT"
}

export interface VariationAxes {
  [tag: string]: Range;
}
