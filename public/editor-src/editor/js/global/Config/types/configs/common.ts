import { NewType } from "visual/types/NewType";

export type Response<R> = (r: R) => void;

//#region Image

export interface Data {
  uid: string;
  fileName: string;
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
