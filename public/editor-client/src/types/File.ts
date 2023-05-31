import { Response } from "./Response";

//#region File

export interface UploadData {
  uid: string;
  filename: string;
}

export interface AddFileExtra {
  acceptedExtensions: Array<string>;
}

export type AddFileData = {
  label?: string;
  handler: (
    res: Response<UploadData>,
    rej: Response<string>,
    extra: AddFileExtra
  ) => void;
};

//#endregion
