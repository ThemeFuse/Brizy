import { Response } from "./Response";

//#region File
export interface UploadData {
  name: string;
  filename: string;
}

export interface ResData {
  uid: string;
  filename: string;
}

export interface AddFileExtra {
  acceptedExtensions: Array<string>;
}

export type AddFileData = {
  label?: string;
  handler: (
    res: Response<ResData>,
    rej: Response<string>,
    extra: AddFileExtra
  ) => void;
};

//#endregion
