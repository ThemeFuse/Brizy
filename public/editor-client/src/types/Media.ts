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

export type AddMediaGallery = {
  label?: string;
  handler: (
    res: Response<Array<AddImageData>>,
    rej: Response<string>,
    extra: AddMediaExtra
  ) => void;
};

export type SelectionData<T> = {
  id: T;
  attributes: {
    filename: string;
  };
};

export type ImageUpload = {
  id: number;
  fileName: string;
};

//#endregion
