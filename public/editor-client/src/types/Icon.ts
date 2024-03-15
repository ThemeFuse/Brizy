import { throwOnNullish } from "@/utils/throwOnNullish";
import { Obj, pipe, Str } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import { UploadData } from "./File";
import { Response } from "./Response";

interface IconData {
  uid: string;
  name: string;
}

export interface ResData {
  uid: string;
  filename: string;
}

export type UploadIconData = (
  icon: File,
  {
    onUpload,
    onError
  }: {
    onUpload: (uploadData: UploadData) => void;
    onError: VoidFunction;
  }
) => void;

export interface AddIconExtra {
  acceptedExtensions?: Array<string>;
  uid: string;
}

export interface CustomIcon {
  get: (res: Response<IconData[]>, rej: Response<string>) => void;
  add: (
    res: Response<IconData>,
    rej: Response<string>,
    extra: AddIconExtra
  ) => void;
  delete: (
    res: Response<string>,
    rej: Response<string>,
    extra: AddIconExtra
  ) => void;
}

export const readIconUrl = (url: string) =>
  pipe(
    mPipe(Obj.readKey("customIcon"), Obj.read, Obj.readKey(url), Str.read),
    throwOnNullish(`Invalid API: ${url}`)
  );
