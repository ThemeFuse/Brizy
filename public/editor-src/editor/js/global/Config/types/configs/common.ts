import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { NewType } from "visual/types/NewType";
import { ImageType } from "visual/utils/image/types";

export type Response<R> = (r: R) => void;

//#region Image

export interface Data {
  uid: string;
  fileName: string;
  imageType?: ImageType;
}

export interface FileUploadData {
  uid: string;
  filename: string;
}

export interface AddImageExtra {
  acceptedExtensions: Array<string>;
}

export interface AddFileExtra {
  acceptedExtensions: Array<string>;
  componentId?: ElementTypes;
}

export enum SizeType {
  custom = "custom",
  original = "original"
}

export type OthersSizeType = NewType<string, "OtherSizeType">;

export type AddImageData = Data;

export type AddFileData = FileUploadData;

export interface CropData {
  iW: number;
  iH: number | "any";
  oX?: number;
  oY?: number;
  cW?: number;
  cH?: number;
}

export const defaultCrop: CropData = {
  iW: 5000,
  iH: "any"
};

//#endregion

//#region Form

export interface FormFieldsOption {
  title: string;
  value: string;
}

//#endregion

//#region Screenshot

export interface ScreenshotData {
  base64: string;
  blockType: "normal" | "global" | "saved" | "layout";
}

//#endregion
