import { readIconUrl } from "@/types/Icon";
import { Arr, Bool, Obj, Str } from "@brizy/readers";
import { match, mPipe, optional, parseStrict } from "fp-utilities";
import { CollectionType } from "./types/Collections";
import { ImagePatterns, PLUGIN_ENV } from "./types/global";
import { pipe } from "./utils/fp/pipe";
import { onNullish } from "./utils/onNullish";
import { throwOnNullish } from "./utils/throwOnNullish";
import { MValue } from "./utils/types";

interface DefaultTemplates {
  layoutDataUrl: string;
  layoutsChunkUrl: string;
  layoutsPagesUrl: string;
  blocksChunkUrl: string;
  blocksDataUrl: string;
  blocksKitsUrl: string;
  popupsChunkUrl: string;
  popupsDataUrl: string;
  storiesChunkUrl: string;
  storiesPagesUrl: string;
  storiesDataUrl: string;
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
  adobeFontsUrl: string;
  addAccount: string;

  getDynamicContentPlaceholders: string;

  createGlobalBlock: string;
  updateGlobalBlock: string;
  updateGlobalBlocks: string;
  placeholdersContent: string;
  lockProject: string;
  removeLock: string;
  heartBeat: string;
  takeOver: string;
  getFonts: string;
}

interface ProjectStatus {
  locked: boolean;
  lockedBy: boolean | { user_email: string };
}

interface Project {
  status: ProjectStatus;
}

interface API {
  mediaResizeUrl: string;
  fileUrl: string;
  templates: DefaultTemplates;
  openAIUrl?: string;
  iconsUrl?: string;
  iconUrl?: string;
  deleteIconUrl?: string;
  uploadIconUrl?: string;
  imagePatterns: ImagePatterns;
  templatesImageUrl: string;
}

export interface Config {
  hash: string;
  editorVersion: string;
  url: string;
  pageId: string;
  actions: Actions;
  project: Project;
  api: API;
  l10n?: Record<string, string>;
  collectionTypes: CollectionType[];
  aiGlobalStyleUrl: string;
}

const templatesReader = parseStrict<Record<string, unknown>, DefaultTemplates>({
  layoutDataUrl: pipe(
    mPipe(Obj.readKey("layoutDataUrl"), Str.read),
    throwOnNullish("Invalid API Config: layouts")
  ),
  layoutsChunkUrl: pipe(
    mPipe(Obj.readKey("layoutsChunkUrl"), Str.read),
    throwOnNullish("Invalid API Config: layouts")
  ),
  layoutsPagesUrl: pipe(
    mPipe(Obj.readKey("layoutsPagesUrl"), Str.read),
    throwOnNullish("Invalid API Config: layouts")
  ),
  blocksChunkUrl: pipe(
    mPipe(Obj.readKey("blocksChunkUrl"), Str.read),
    throwOnNullish("Invalid API Config: kits")
  ),
  blocksDataUrl: pipe(
    mPipe(Obj.readKey("blocksDataUrl"), Str.read),
    throwOnNullish("Invalid API Config: kits")
  ),
  blocksKitsUrl: pipe(
    mPipe(Obj.readKey("blocksKitsUrl"), Str.read),
    throwOnNullish("Invalid API Config: kits")
  ),
  popupsChunkUrl: pipe(
    mPipe(Obj.readKey("popupsChunkUrl"), Str.read),
    throwOnNullish("Invalid API Config: popups")
  ),
  popupsDataUrl: pipe(
    mPipe(Obj.readKey("popupsDataUrl"), Str.read),
    throwOnNullish("Invalid API Config: popups")
  ),
  storiesChunkUrl: pipe(
    mPipe(Obj.readKey("storiesChunkUrl"), Str.read),
    throwOnNullish("Invalid API Config: stories")
  ),
  storiesPagesUrl: pipe(
    mPipe(Obj.readKey("storiesPagesUrl"), Str.read),
    throwOnNullish("Invalid API Config: stories")
  ),
  storiesDataUrl: pipe(
    mPipe(Obj.readKey("storiesDataUrl"), Str.read),
    throwOnNullish("Invalid API Config: stories")
  )
});

const collectionTypesReader = (arr: Array<unknown>): Array<CollectionType> => {
  return arr.filter(
    (o): o is CollectionType => Obj.isObject(o) && !!o.label && !!o.name
  );
};

const imagePatternsReader = parseStrict<
  Record<string, unknown>,
  Required<ImagePatterns>
>({
  full: pipe(
    mPipe(Obj.readKey("full"), Str.read),
    throwOnNullish("Invalid API: ImagePatterns full pattern")
  ),
  original: pipe(
    mPipe(Obj.readKey("original"), Str.read),
    throwOnNullish("Invalid API: ImagePatterns original pattern")
  ),
  split: pipe(
    mPipe(Obj.readKey("split"), Str.read),
    throwOnNullish("Invalid API: ImagePatterns split pattern")
  )
});

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
  fileUrl: pipe(
    mPipe(
      Obj.readKey("customFile"),
      Obj.read,
      Obj.readKey("fileUrl"),
      Str.read
    ),
    throwOnNullish("Invalid actions: fileUrl")
  ),
  templates: pipe(
    mPipe(Obj.readKey("templates"), Obj.read, templatesReader),
    throwOnNullish("Invalid API: templates")
  ),
  openAIUrl: optional(mPipe(Obj.readKey("openAIUrl"), Str.read)),
  imagePatterns: pipe(
    mPipe(
      Obj.readKey("media"),
      Obj.read,
      Obj.readKey("imagePatterns"),
      Obj.read,
      imagePatternsReader
    ),
    throwOnNullish("Invalid API: image patterns")
  ),
  templatesImageUrl: pipe(
    mPipe(Obj.readKey("templatesImageUrl"), Str.read),
    throwOnNullish("Invalid API: templatesImageUrl")
  ),
  iconUrl: readIconUrl("iconUrl"),
  iconsUrl: readIconUrl("getIconsUrl"),
  uploadIconUrl: readIconUrl("uploadIconUrl"),
  deleteIconUrl: readIconUrl("deleteIconUrl")
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
  ),
  adobeFontsUrl: pipe(
    mPipe(Obj.readKey("adobeFontsUrl"), Str.read),
    throwOnNullish("Invalid actions: adobeFontsUrl")
  ),
  addAccount: pipe(
    mPipe(Obj.readKey("addAccount"), Str.read),
    throwOnNullish("Invalid actions: addAccount")
  ),
  getDynamicContentPlaceholders: pipe(
    mPipe(Obj.readKey("getDynamicContentPlaceholders"), Str.read),
    throwOnNullish("Invalid actions: getDynamicContentPlaceholders")
  ),
  createGlobalBlock: pipe(
    mPipe(Obj.readKey("createGlobalBlock"), Str.read),
    throwOnNullish("Invalid actions: createGlobalBlock")
  ),
  updateGlobalBlock: pipe(
    mPipe(Obj.readKey("updateGlobalBlock"), Str.read),
    throwOnNullish("Invalid actions: updateGlobalBlock")
  ),
  updateGlobalBlocks: pipe(
    mPipe(Obj.readKey("updateGlobalBlocks"), Str.read),
    throwOnNullish("Invalid actions: updateGlobalBlocks")
  ),
  placeholdersContent: pipe(
    mPipe(Obj.readKey("placeholdersContent"), Str.read),
    throwOnNullish("Invalid actions: getDCPlaceholderContent")
  ),
  lockProject: pipe(
    mPipe(Obj.readKey("lockProject"), Str.read),
    throwOnNullish("Invalid API: projectLock")
  ),
  removeLock: pipe(
    mPipe(Obj.readKey("removeLock"), Str.read),
    throwOnNullish("Invalid API: projectUnlock")
  ),
  heartBeat: pipe(
    mPipe(Obj.readKey("heartBeat"), Str.read),
    throwOnNullish("Invalid actions: heartBeat")
  ),
  takeOver: pipe(
    mPipe(Obj.readKey("takeOver"), Str.read),
    throwOnNullish("Invalid actions: takeOver")
  ),
  getFonts: pipe(
    mPipe(Obj.readKey("getFonts"), Str.read),
    throwOnNullish("Invalid actions: getFonts")
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
  ),
  project: pipe(
    mPipe(
      Obj.readKey("project"),
      Obj.read,
      parseStrict<PLUGIN_ENV["project"], Project>({
        status: pipe(
          mPipe(
            Obj.readKey("status"),
            Obj.read,
            parseStrict<PLUGIN_ENV["project"], ProjectStatus>({
              locked: pipe(
                mPipe(Obj.readKey("locked"), Bool.read),
                throwOnNullish("Invalid: locked")
              ),
              lockedBy: pipe(
                mPipe(
                  Obj.readKey("lockedBy"),
                  match(
                    [(v): v is boolean => typeof v === "boolean", (v) => v],
                    [
                      (v): v is ProjectStatus["lockedBy"] => {
                        return Obj.isObject(v) && "user_email" in v;
                      },
                      (v) => v
                    ]
                  )
                ),
                throwOnNullish("Invalid: lockedBy")
              )
            })
          ),
          throwOnNullish("Invalid: status")
        )
      })
    ),
    throwOnNullish("Invalid: project")
  ),
  aiGlobalStyleUrl: pipe(
    mPipe(Obj.readKey("aiGlobalStyleUrl"), Str.read),
    throwOnNullish("Invalid: aiGlobalStyleUrl")
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
