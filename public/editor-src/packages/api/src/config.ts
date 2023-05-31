import { mPipe, optional, parseStrict } from "fp-utilities";
import { CLOUD_ENV } from "./types/global";
import { pipe } from "./utils/fp/pipe";
import * as Obj from "./utils/reader/object";
import * as Str from "./utils/reader/string";
import { throwOnNullish } from "./utils/throwOnNullish";
import { MValue } from "./utils/types";

export interface API {
  uploadMediaUrl: string;
  uploadFileUrl: string;
}

export interface Config {
  editorVersion: string;
  mediaResizeUrl: string;
  fileUrl: string;
  api: API;
  token?: string;
  projectId: string;
}

const apiReader = parseStrict<CLOUD_ENV["api"], API>({
  uploadMediaUrl: pipe(
    mPipe(Obj.readKey("uploadMediaUrl"), Str.read),
    throwOnNullish("Invalid API: uploadMediaUrl")
  ),
  uploadFileUrl: pipe(
    mPipe(Obj.readKey("uploadFileUrl"), Str.read),
    throwOnNullish("Invalid API: uploadFileUrl")
  )
});

const reader = parseStrict<CLOUD_ENV, Config>({
  editorVersion: pipe(
    mPipe(Obj.readKey("editorVersion"), Str.read),
    throwOnNullish("Invalid: editorVersion")
  ),
  mediaResizeUrl: pipe(
    mPipe(Obj.readKey("mediaResizeUrl"), Str.read),
    throwOnNullish("Invalid: mediaResizeUrl")
  ),
  fileUrl: pipe(
    mPipe(Obj.readKey("fileUrl"), Str.read),
    throwOnNullish("Invalid: fileUrl")
  ),
  api: pipe(
    mPipe(Obj.readKey("api"), Obj.read, apiReader),
    throwOnNullish("Invalid: api")
  ),
  token: optional(mPipe(Obj.readKey("token"), Str.read)),
  projectId: pipe(
    mPipe(Obj.readKey("projectId"), Str.read),
    throwOnNullish("Invalid: projectId")
  )
});

export const getConfig = (): MValue<Config> => {
  const __CLOUD_ENV__ = window.__CLOUD_ENV__ ?? {};
  const parsed = reader(__CLOUD_ENV__);

  if (parsed === undefined) {
    throw new Error("Failed to parse __CLOUD_ENV__");
  }

  return parsed;
};
