import { mPipe, parseStrict } from "fp-utilities";
import { PLUGIN_ENV } from "./types/global";
import { pipe } from "./utils/fp/pipe";
import * as Obj from "./utils/reader/object";
import * as Str from "./utils/reader/string";
import { throwOnNullish } from "./utils/throwOnNullish";
import { MValue } from "./utils/types";

interface Actions {
  getMediaUid: string;
  mediaResizeUrl: string;
}

interface Config {
  hash: string;
  editorVersion: string;
  url: string;
  pageId: string;
  actions: Actions;
}

const actionsReader = parseStrict<PLUGIN_ENV["actions"], Actions>({
  getMediaUid: pipe(
    mPipe(Obj.readKey("getMediaUid"), Str.read),
    throwOnNullish("Invalid actions: getMediaUid")
  ),
  mediaResizeUrl: pipe(
    mPipe(Obj.readKey("mediaResizeUrl"), Str.read),
    throwOnNullish("Invalid actions: mediaResizeUrl")
  )
});

const reader = parseStrict<PLUGIN_ENV, Config>({
  pageId: pipe(
    mPipe(Obj.readKey("pageId"), Str.read),
    throwOnNullish("Invalid: pageId")
  ),
  editorVersion: pipe(
    mPipe(Obj.readKey("editorVersion"), Str.read),
    throwOnNullish("Invalid: editorVersion")
  ),
  hash: pipe(
    mPipe(Obj.readKey("hash"), Str.read),
    throwOnNullish("Invalid: hash")
  ),
  url: pipe(
    mPipe(Obj.readKey("url"), Str.read),
    throwOnNullish("Invalid: url")
  ),
  actions: pipe(
    mPipe(Obj.readKey("actions"), Obj.read, actionsReader),
    throwOnNullish("Invalid: Actions")
  )
});

export const getConfig = (): MValue<Config> => {
  const __BRZ_PLUGIN_ENV__ = window.__BRZ_PLUGIN_ENV__ ?? {};
  const parsed = reader(__BRZ_PLUGIN_ENV__);

  if (parsed === undefined) {
    throw new Error("Failed to parse __BRZ_PLUGIN_ENV__");
  }

  return parsed;
};
