import { Response } from "../common";

export interface AddFileData {
  filename: string;
}

export interface AddFileExtra {
  acceptedExtensions: Array<string>;
}

export interface CustomFile {
  fileUrl?: string;

  addFile?: {
    handler: (
      res: Response<AddFileData>,
      rej: Response<string>,
      extra: AddFileExtra
    ) => void;
  };
}
