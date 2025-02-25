import { Response } from "../common";

export interface AddMediaData {
  uid: string;
  fileName?: string;
}

export interface AddMediaExtra {
  acceptedExtensions: Array<string>;
}

export interface Media {
  mediaResizeUrl?: string;
  imagePatterns?: {
    full: string;
    original: string;
    split: string;
  };

  addMedia?: {
    handler: (
      res: Response<AddMediaData>,
      rej: Response<string>,
      extra: AddMediaExtra
    ) => void;
  };
}
