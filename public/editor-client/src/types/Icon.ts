import { Obj, Str } from "@brizy/readers";
import { mPipe, optional } from "fp-utilities";
import { Response } from "./Response";

export interface IconUploadData {
  uid: string;
}

export interface IconData {
  name: string;
}

export type UploadIconData = (
  icon: File,
  onUpload: (uploadData: IconUploadData) => void,
  onError: VoidFunction
) => void;

export interface AddIconExtra {
  acceptedExtensions?: Array<string>;
}

export interface DeleteIconExtra {
  uid: string;
}

export interface CustomIcon {
  get: (res: Response<IconData[]>, rej: Response<string>) => void;
  add: (
    res: Response<IconData[]>,
    rej: Response<string>,
    extra: AddIconExtra
  ) => void;
  delete: (
    res: Response<string>,
    rej: Response<string>,
    extra: DeleteIconExtra
  ) => void;
}

export const readIconUrl = (url: string) =>
  optional(
    mPipe(Obj.readKey("customIcon"), Obj.read, Obj.readKey(url), Str.read)
  );
