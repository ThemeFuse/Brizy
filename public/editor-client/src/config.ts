import { mPipe, optional, parseStrict } from "fp-utilities";
import { CollectionType } from "./types/Collections";
import { PLUGIN_ENV } from "./types/global";
import { pipe } from "./utils/fp/pipe";
import { onNullish } from "./utils/onNullish";
import * as Arr from "./utils/reader/array";
import * as Obj from "./utils/reader/object";
import * as Str from "./utils/reader/string";
import { throwOnNullish } from "./utils/throwOnNullish";
import { MValue } from "./utils/types";

interface DefaultTemplates {
  kitsUrl: string;
  popupsUrl: string;
  storiesUrl: string;
  layoutsUrl: string;
}

interface Actions {
  getMediaUid: string;
  getAttachmentUid: string;
  setProject: string;
  updatePage: string;
  updateRules: string;

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

  getPostObjects: string;

  searchPosts: string;

  createBlockScreenshot: string;
  updateBlockScreenshot: string;
}

interface API {
  mediaResizeUrl: string;
  customFileUrl: string;
  templates: DefaultTemplates;
}
export interface Config {
  hash: string;
  editorVersion: string;
  url: string;
  pageId: string;
  actions: Actions;
  api: API;
  l10n?: Record<string, string>;
  collectionTypes: CollectionType[];
}

const templatesReader = parseStrict<Record<string, unknown>, DefaultTemplates>({
  kitsUrl: pipe(
    mPipe(Obj.readKey("kitsUrl"), Str.read),
    throwOnNullish("Invalid API Config: kits")
  ),
  layoutsUrl: pipe(
    mPipe(Obj.readKey("layoutsUrl"), Str.read),
    throwOnNullish("Invalid API Config: layouts")
  ),
  popupsUrl: pipe(
    mPipe(Obj.readKey("popupsUrl"), Str.read),
    throwOnNullish("Invalid API Config: popups")
  ),
  storiesUrl: pipe(
    mPipe(Obj.readKey("storiesUrl"), Str.read),
    throwOnNullish("Invalid API Config: stories")
  )
});

const collectionTypesReader = (arr: Array<unknown>): Array<CollectionType> => {
  return arr.filter(
    (o): o is CollectionType => Obj.isObject(o) && !!o.label && !!o.name
  );
};

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
  ),
  templates: pipe(
    mPipe(Obj.readKey("templates"), Obj.read, templatesReader),
    throwOnNullish("Invalid API: templates")
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
  updatePage: pipe(
    mPipe(Obj.readKey("updatePage"), Str.read),
    throwOnNullish("Invalid actions: updatePage")
  ),
  updateRules: pipe(
    mPipe(Obj.readKey("updateRules"), Str.read),
    throwOnNullish("Invalid actions: updateRules")
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
  ),
  getPostObjects: pipe(
    mPipe(Obj.readKey("getPostObjects"), Str.read),
    throwOnNullish("Invalid actions: getPostObjects")
  ),
  searchPosts: pipe(
    mPipe(Obj.readKey("searchPosts"), Str.read),
    throwOnNullish("Invalid actions: searchPosts")
  ),
  createBlockScreenshot: pipe(
    mPipe(Obj.readKey("createBlockScreenshot"), Str.read),
    throwOnNullish("Invalid actions: createBlockScreenshot")
  ),
  updateBlockScreenshot: pipe(
    mPipe(Obj.readKey("updateBlockScreenshot"), Str.read),
    throwOnNullish("Invalid actions: updateBlockScreenshot")
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
  l10n: optional(pipe(Obj.readKey("l10n"), Obj.read, onNullish({}))),
  collectionTypes: pipe(
    mPipe(Obj.readKey("collectionTypes"), Arr.read, collectionTypesReader),
    throwOnNullish("Invalid: collectionTypes")
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
