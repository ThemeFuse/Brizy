import { Response } from "./Response";

//#region Media

export interface AddImageData {
  uid: string;
  fileName: string;
}

export interface AddMediaExtra {
  acceptedExtensions: Array<string>;
}

export type AddMediaData = {
  label?: string;
  handler: (
    res: Response<AddImageData>,
    rej: Response<string>,
    extra: AddMediaExtra
  ) => void;
};

//#endregion
