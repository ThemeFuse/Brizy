import { mPipe, optional, parseStrict } from "fp-utilities";
import { PLUGIN_ENV } from "./types/global";
import { pipe } from "./utils/fp/pipe";
import { onNullish } from "./utils/onNullish";
import * as Obj from "./utils/reader/object";
import * as Str from "./utils/reader/string";
import { throwOnNullish } from "./utils/throwOnNullish";
import { MValue } from "./utils/types";

interface Actions {
  getMediaUid: string;
  getAttachmentUid: string;
  setProject: string;

  getSavedBlockList: string;
  getSavedBlockByUid: string;
  createSavedBlock: string;
  updateSavedBlock: string;
  deleteSavedBlock: string;
  uploadBlocks: string;

  createLayout: string;
  getLayoutList: string;
  getLayoutByUid: string;
  updateLayout: string;
  deleteLayout: string;
}

interface API {
  mediaResizeUrl: string;
  customFileUrl: string;
}
interface Config {
  hash: string;
  editorVersion: string;
  url: string;
  pageId: string;
  actions: Actions;
  api: API;
  l10n?: Record<string, string>;
}

const apiReader = parseStrict<PLUGIN_ENV["api"], API>({
  mediaResizeUrl: pipe(
    mPipe(
      Obj.readKey("media"),
      Obj.read,
      Obj.readKey("mediaResizeUrl"),
      Str.read
    ),
    throwOnNullish("Invalid actions: mediaResizeUrl")
  ),
  customFileUrl: pipe(
    mPipe(
      Obj.readKey("customFile"),
      Obj.read,
      Obj.readKey("customFileUrl"),
      Str.read
    ),
    throwOnNullish("Invalid actions: customFileUrl")
  )
});

const actionsReader = parseStrict<PLUGIN_ENV["actions"], Actions>({
  getMediaUid: pipe(
    mPipe(Obj.readKey("getMediaUid"), Str.read),
    throwOnNullish("Invalid actions: getMediaUid")
  ),
  getAttachmentUid: pipe(
    mPipe(Obj.readKey("getAttachmentUid"), Str.read),
    throwOnNullish("Invalid actions: getAttachmentUid")
  ),
  setProject: pipe(
    mPipe(Obj.readKey("setProject"), Str.read),
    throwOnNullish("Invalid actions: setProject")
  ),
  createSavedBlock: pipe(
    mPipe(Obj.readKey("createSavedBlock"), Str.read),
    throwOnNullish("Invalid actions: createSavedBlock")
  ),
  getSavedBlockList: pipe(
    mPipe(Obj.readKey("getSavedBlockList"), Str.read),
    throwOnNullish("Invalid actions: getSavedBlockList")
  ),
  getSavedBlockByUid: pipe(
    mPipe(Obj.readKey("getSavedBlockByUid"), Str.read),
    throwOnNullish("Invalid actions: getSavedBlockByUid")
  ),
  updateSavedBlock: pipe(
    mPipe(Obj.readKey("updateSavedBlock"), Str.read),
    throwOnNullish("Invalid actions: updateSavedBlock")
  ),
  deleteSavedBlock: pipe(
    mPipe(Obj.readKey("deleteSavedBlock"), Str.read),
    throwOnNullish("Invalid actions: deleteSavedBlock")
  ),
  uploadBlocks: pipe(
    mPipe(Obj.readKey("uploadBlocks"), Str.read),
    throwOnNullish("Invalid actions: uploadBlocks")
  ),
  createLayout: pipe(
    mPipe(Obj.readKey("createLayout"), Str.read),
    throwOnNullish("Invalid actions: createLayout")
  ),
  getLayoutList: pipe(
    mPipe(Obj.readKey("getLayoutList"), Str.read),
    throwOnNullish("Invalid actions: getLayoutList")
  ),
  getLayoutByUid: pipe(
    mPipe(Obj.readKey("getLayoutByUid"), Str.read),
    throwOnNullish("Invalid actions: getLayoutByUid")
  ),
  updateLayout: pipe(
    mPipe(Obj.readKey("updateLayout"), Str.read),
    throwOnNullish("Invalid actions: updateLayout")
  ),
  deleteLayout: pipe(
    mPipe(Obj.readKey("deleteLayout"), Str.read),
    throwOnNullish("Invalid actions: deleteLayout")
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
  ),
  api: pipe(
    mPipe(Obj.readKey("api"), Obj.read, apiReader),
    throwOnNullish("Invalid: api")
  ),
  l10n: optional(pipe(Obj.readKey("l10n"), Obj.read, onNullish({})))
});

export const getConfig = (): MValue<Config> => {
  const __BRZ_PLUGIN_ENV__ = window.__BRZ_PLUGIN_ENV__ ?? {};
  const parsed = reader(__BRZ_PLUGIN_ENV__);

  if (parsed === undefined) {
    throw new Error("Failed to parse __BRZ_PLUGIN_ENV__");
  }

  return parsed;
};
