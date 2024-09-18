import { Config, getConfig } from "@/config";
import {
  isDefaultBlock,
  isDefaultBlockArray,
  isDefaultBlockWithID,
  isDefaultBlockWithIDArray,
  isKitDataItems,
  isKitDataResult,
  isLayoutDataResult,
  isPopupDataResult,
  isPopupsResponse,
  isStoryDataBlocks,
  isStoryDataResponse
} from "@/defaultTemplates/utils";
import {
  APIPopup,
  DefaultBlock,
  DefaultBlockWithID,
  Kit,
  KitDataResult,
  KitItem,
  LayoutsAPI,
  LayoutsPagesResult,
  StoriesAPI,
  StoryPagesResult,
  Style
} from "@/types/DefaultTemplate";
import { ConfigDCItem } from "@/types/DynamicContent";
import { GlobalBlock } from "@/types/GlobalBlocks";
import { IconUploadData } from "@/types/Icon";
import { Page } from "@/types/Page";
import { Rule } from "@/types/PopupConditions";
import { Project } from "@/types/Project";
import { ResponseWithBody } from "@/types/Response";
import {
  CreateSavedBlock,
  CreateSavedLayout,
  SavedBlock,
  SavedBlockMeta,
  SavedLayout,
  SavedLayoutMeta
} from "@/types/SavedBlocks";
import { ScreenshotData } from "@/types/Screenshots";
import { t } from "@/utils/i18n";
import { Arr, Json, Obj, Str } from "@brizy/readers";
import { isT, mPipe, pass } from "fp-utilities";
import { Dictionary } from "../types/utils";
import { Literal } from "../utils/types";
import {
  GetCollections,
  parseMetaSavedBlock,
  parseSavedBlock,
  parseSavedLayout,
  stringifyGlobalBlock,
  stringifyPage,
  stringifyProject,
  stringifySavedBlock
} from "./adapter";
import { makeFormEncode, makeUrl } from "./utils";

//#region Common Utils Request & PersistentRequest

interface Pagination {
  count: number;
  page: number;
  order?: "DESC" | "ASC";
  orderBy?: string;
}

export const paginationData = {
  page: 1,
  count: 300,
  orderBy: undefined,
  order: undefined
} as const;

export function request(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  // will see later if we'll have to hardcode
  // some settings into config like we do for brizy cloud
  // In WP referer must be root window not iframe
  const { fetch } = window.parent || window;
  return fetch(url, config);
}

export function persistentRequest<T>(
  url: string,
  config: RequestInit = {}
): Promise<ResponseWithBody<T>> {
  return new Promise((resolve, reject) => {
    let failedAttempts = 0;

    const req = (url: string, config: RequestInit) => {
      return request(url, config).then((r) => {
        if (r.status === 500) {
          // >= 500 - server unavailable
          if (failedAttempts <= 5) {
            failedAttempts++;
            setTimeout(() => {
              req(url, config);
            }, 5000 * failedAttempts);
          } else {
            reject(r);
          }
        } else {
          r.json()
            .then((body) => {
              resolve({
                status: r.status,
                ok: r.ok,
                data: body.data
              });
            })
            .catch(reject);
        }
      });
    };

    req(url, config);
  });
}

//#endregion

//#region Image

export const getImageUid = async (id: string): Promise<{ uid: string }> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { pageId, url, hash, editorVersion, actions } = config;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: actions.getMediaUid,
    post_id: pageId,
    attachment_id: id
  });

  const r = await request(url, {
    method: "POST",
    body
  });

  const rj = await r.json();

  if (rj.success) {
    return rj.data;
  } else {
    throw rj;
  }
};

//#endregion

//#region Project

export function updateProject(
  project: Project,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { url: _url, hash, editorVersion, actions } = config;

  const url = makeUrl(_url, {
    action: actions.setProject,
    version: editorVersion,
    hash
  });
  const { is_autosave = 1 } = meta;
  const { data, dataVersion, compiled } = stringifyProject(project);
  const body = new URLSearchParams({
    data,
    dataVersion,
    ...(compiled && { compiled }),
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(url, { method: "POST", body });
}

export async function addProjectLockedBeacon({
  lockProject,
  url: _url,
  hash,
  version
}: {
  lockProject: string;
  url: string;
  hash: string;
  version: string;
}) {
  try {
    const url = makeUrl(_url, {
      version,
      hash,
      action: lockProject
    });

    await request(url, {
      method: "GET"
    });
  } catch (e) {
    throw new Error("API Client: Fail to lock project");
  }
}

export function removeProjectLockedSendBeacon({
  removeLock,
  url: _url,
  version
}: {
  removeLock: string;
  url: string;
  version: string;
}) {
  return () => {
    navigator.sendBeacon(
      makeUrl(_url, {
        action: removeLock,
        version
      })
    );
  };
}

//#endregion

//#region Attachment byId

export async function getAttachmentById(id: string): Promise<{ uid: string }> {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url, hash, actions } = config;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: actions.getAttachmentUid,
    attachment_id: id
  });

  const r = await request(url, {
    method: "POST",
    body
  });

  const rj = await r.json();

  if (rj.success) {
    return rj.data;
  } else {
    throw rj;
  }
}

//#endregion

//#region Saved blocks

export const getSavedBlocks = (
  pagination: Pagination
): Promise<Array<SavedBlockMeta>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const {
    count,
    page,
    orderBy = "id",
    order = "ASC"
  } = pagination || paginationData;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      orderBy,
      order,
      count,
      page,
      action: actions.getSavedBlockList,
      version: editorVersion,
      fields: [
        "uid",
        "meta",
        "title",
        "tags",
        "dataVersion",
        "synchronized",
        "synchronizable"
      ]
    })
  );

  return request(url, { method: "GET" })
    .then((r) => r.json())
    .then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedBlockById = (uid: string): Promise<SavedBlock> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    uid,
    hash,
    action: actions.getSavedBlockByUid,
    version: editorVersion
  });

  return request(url, { method: "GET" })
    .then((r) => r.json())
    .then(({ data }) => parseSavedBlock(data));
};

export const createSavedBlock = (
  block: CreateSavedBlock
): Promise<SavedBlock> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    hash,
    action: actions.createSavedBlock,
    version: editorVersion
  });
  const { uid, data, title, tags, dataVersion, meta, media } =
    stringifySavedBlock<CreateSavedBlock>(block);

  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
    ...(title && { title }),
    ...(tags && { tags }),
    dataVersion: `${dataVersion}`
  });

  return persistentRequest<SavedBlock>(url, { method: "POST", body }).then(
    (d) => {
      if (!d.ok) {
        throw new Error(t("Fail to create saved block"));
      }

      return d.data;
    }
  );
};

export const updateSavedBlock = (
  savedBlock: SavedBlockMeta
): Promise<SavedBlockMeta> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const { uid, title, dataVersion } = savedBlock;
  let { tags } = savedBlock;
  // if empty string is passed backend doesn't remove tag
  // https://github.com/bagrinsergiu/blox-editor/issues/23277#issuecomment-1610911099
  if (tags === "") {
    tags = ",";
  }
  const body = new URLSearchParams({
    uid,
    ...(title && { title }),
    ...(tags && { tags }),
    dataVersion: `${dataVersion}`
  });
  const url = makeUrl(_url, {
    hash,
    action: actions.updateSavedBlock,
    version: editorVersion
  });

  return persistentRequest<SavedBlockMeta>(url, { method: "POST", body }).then(
    (d) => {
      if (!d.ok) {
        throw new Error(t("Fail to update saved block"));
      }

      return d.data;
    }
  );
};

export const deleteSavedBlock = (uid: string): Promise<unknown> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    action: actions.deleteSavedBlock,
    version: editorVersion,
    hash,
    uid
  });

  return request(url, { method: "DELETE" });
};

export interface UploadSavedBlocksData {
  errors: Array<{ uid: string; message: string }>;
  success: Array<SavedBlock>;
}

export const uploadSaveBlocks = async (
  files: Array<File>
): Promise<UploadSavedBlocksData> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url, hash, actions } = config;
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  formData.append("version", editorVersion);
  formData.append("hash", hash);
  formData.append("action", actions.uploadBlocks);

  const r = await request(url, { method: "POST", body: formData });
  const rj = await r.json();

  if (rj.success && rj.data.errors && rj.data.success) {
    return {
      errors: rj.data.errors,
      success: rj.data.success.map(parseSavedBlock)
    };
  }

  throw rj;
};

//#endregion

//#region Saved Layouts

export const getSavedLayouts = (
  pagination: Pagination
): Promise<Array<SavedLayoutMeta>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const {
    count,
    page,
    orderBy = "id",
    order = "ASC"
  } = pagination || paginationData;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      orderBy,
      order,
      count,
      page,
      action: actions.getLayoutList,
      version: editorVersion,
      fields: [
        "uid",
        "meta",
        "title",
        "tags",
        "globalStyles",
        "dataVersion",
        "synchronized",
        "synchronizable"
      ]
    })
  );

  return request(url, { method: "GET" })
    .then((r) => r.json())
    .then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedLayoutById = (uid: string): Promise<SavedLayout> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    uid,
    hash,
    action: actions.getLayoutByUid,
    version: editorVersion
  });

  return request(url, { method: "GET" })
    .then((r) => r.json())
    .then(({ data }) => parseSavedLayout(data));
};

export const createSavedLayout = (
  block: CreateSavedLayout
): Promise<SavedLayout> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    hash,
    action: actions.createLayout,
    version: editorVersion
  });
  const { data, dataVersion, title, tags, uid, meta, media, globalStyles } =
    stringifySavedBlock<CreateSavedLayout>(block);

  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
    globalStyles: globalStyles ?? "",
    ...(title && { title }),
    ...(tags && { tags }),
    dataVersion: `${dataVersion}`
  });

  return persistentRequest<SavedLayout>(url, { method: "POST", body }).then(
    (d) => {
      if (!d.ok) {
        throw new Error(t("Fail to create saved layout"));
      }

      return d.data;
    }
  );
};

export const updateSavedLayout = (
  savedLayout: SavedLayoutMeta
): Promise<SavedLayoutMeta> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const { uid, title, dataVersion, globalStyles } = savedLayout;
  let { tags } = savedLayout;
  // if empty string is passed backend doesn't remove tag
  // https://github.com/bagrinsergiu/blox-editor/issues/23277#issuecomment-1610911099
  if (tags === "") {
    tags = ",";
  }

  const body = new URLSearchParams({
    uid,
    ...(title && { title }),
    ...(tags && { tags }),
    dataVersion: `${dataVersion}`,
    globalStyles: globalStyles ?? ""
  });
  const url = makeUrl(_url, {
    hash,
    action: actions.updateLayout,
    version: editorVersion
  });

  return persistentRequest<SavedLayoutMeta>(url, { method: "POST", body }).then(
    (d) => {
      if (!d.ok) {
        throw new Error(t("Fail to update saved layout"));
      }

      return d.data;
    }
  );
};

export const deleteSavedLayout = (uid: string): Promise<unknown> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    action: actions.deleteLayout,
    version: editorVersion,
    hash,
    uid
  });

  return request(url, { method: "DELETE" });
};

export interface UploadSavedLayoutsData {
  errors: Array<{ uid: string; message: string }>;
  success: Array<SavedLayout>;
}

export const uploadSaveLayouts = async (
  files: Array<File>
): Promise<UploadSavedLayoutsData> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url, hash, actions } = config;
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  formData.append("version", editorVersion);
  formData.append("hash", hash);
  formData.append("action", actions.uploadBlocks);

  const r = await request(url, { method: "POST", body: formData });
  const rj = await r.json();

  if (rj.success && rj.data.errors && rj.data.success) {
    return {
      errors: rj.data.errors,
      success: rj.data.success.map(parseSavedLayout)
    };
  }

  throw rj;
};

//#endregion

//#region Collections

export const getCollections: GetCollections = async (
  { search = "", postType, abortSignal },
  config
) => {
  const {
    url,
    hash,
    actions: { searchPosts }
  } = config;

  const version = config.editorVersion;
  const body = new URLSearchParams({
    hash,
    version,
    action: searchPosts
  });

  if (search !== "") {
    body.append("search", search);
  }
  if (postType !== undefined) {
    for (const p of postType) {
      body.append("post_type[]", p);
    }
  }

  const r = await request(url, {
    method: "POST",
    body,
    signal: abortSignal
  });
  const rj = await r.json();

  if (rj.success) {
    return rj.data;
  } else {
    throw rj;
  }
};

export const getCollectionSourceItems = async (id: string) => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  return request(_url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version: editorVersion,
      postType: id,
      action: actions.getPostObjects
    })
  })
    .then((r) => r.json())
    .then((result) => {
      if (!result?.data) {
        throw t("Something went wrong");
      }

      return result.data;
    })
    .catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
      return [];
    });
};

//#endregion

//#region Page

export const updatePage = (
  page: Page,
  meta: { is_autosave?: 0 | 1 } = {}
): Promise<unknown> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;
  const url = makeUrl(_url, {
    action: actions.updatePage,
    version: editorVersion,
    hash
  });
  const { is_autosave = 1 } = meta;
  const { id, status, data, dataVersion, compiled } = stringifyPage(page);
  const body = new URLSearchParams({
    id,
    status,
    data,
    dataVersion,
    ...(compiled && { compiled }),
    is_autosave: `${is_autosave}`
  });

  return persistentRequest<Page>(url, { method: "POST", body }).then((d) => {
    if (!d.ok) {
      throw new Error(t("Fail to update page"));
    }

    return d.data;
  });
};

//#endregion

//#region PopupRules

interface PopupData {
  dataVersion: number;
  rules: Array<Rule>;
}

export const updatePopupRules = async (
  data: PopupData
): Promise<Array<Rule>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }
  const { pageId, url, hash, editorVersion, actions } = config;
  const { rules, dataVersion } = data;

  const _url = makeUrl(url, {
    action: actions.updateRules,
    hash,
    post: pageId,
    version: editorVersion,
    dataVersion: `${dataVersion}`
  });

  try {
    const r = await request(_url, {
      method: "POST",
      body: JSON.stringify(rules)
    });
    const data = await r.json();

    return data.data;
  } catch (e) {
    throw new Error(t("Fail to update popup rules"));
  }
};

//#endregion

//#region Screenshots

export const createBlockScreenshot = async ({
  base64,
  blockType
}: ScreenshotData): Promise<{ id: string }> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { pageId, url, hash, editorVersion, actions } = config;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");
  const _url = makeUrl(url, {
    hash,
    action: actions.createBlockScreenshot,
    post: pageId,
    version: editorVersion
  });
  const body = new URLSearchParams({
    block_type: blockType,
    ibsf: attachment // ibsf - image base64
  });

  try {
    const r = await request(_url, { method: "POST", body });
    const d = await r.json();

    if (d?.data?.id) {
      return { id: d.data.id };
    }

    throw new Error(t("Failed to create Screenshot"));
  } catch (e) {
    throw new Error(t("Failed to create Screenshot"));
  }
};

interface UpdateScreenshot extends ScreenshotData {
  id: string;
}

export const updateBlockScreenshot = async ({
  id,
  base64,
  blockType
}: UpdateScreenshot): Promise<{ id: string }> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { pageId, url, hash, editorVersion, actions } = config;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");
  const _url = makeUrl(url, {
    hash,
    action: actions.updateBlockScreenshot,
    post: pageId,
    version: editorVersion
  });
  const body = new URLSearchParams({
    id,
    block_type: blockType,
    ibsf: attachment
  });

  try {
    const r = await request(_url, { method: "POST", body });
    const d = await r.json();

    if (d?.data?.id) {
      return { id: d.data.id };
    }

    throw new Error(t("Failed to update Screenshot"));
  } catch (e) {
    throw new Error(t("Failed to update Screenshot"));
  }
};

//#endregion

//#region AdobeFonts
interface AddAccount {
  group: string;
  key: string;
}

export const getAdobeFont = async () => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    hash,
    action: actions.adobeFontsUrl,
    version: editorVersion
  });

  const r = await request(url, {
    method: "GET"
  });

  if (r.ok) {
    const d = await r.json();

    if (d) {
      return d.data;
    }
  } else {
    throw new Error(t("Failed to get adobe fonts"));
  }
};

export const addAdobeAccount = async (body: AddAccount) => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { url: _url, hash, editorVersion, actions } = config;

  const url = makeUrl(_url, {
    hash,
    action: actions.addAccount,
    version: editorVersion
  });

  try {
    return await request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    const getError = mPipe(Obj.read, Obj.readKey("message"), Str.read);
    const message = getError(error) ?? "Failed to connect new account";

    throw new Error(`Failed to add Adobe account: ${message}`);
  }
};

//#endregion

//#region Dynamic Content

export const getPlaceholders = (extraData: {
  entityType: string;
  groupType: string;
}): Promise<ConfigDCItem[]> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { entityType, groupType } = extraData;
  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(_url, {
    post: entityType ?? "",
    hash,
    action: actions.getDynamicContentPlaceholders,
    version: editorVersion
  });

  return request(url, { method: "GET" })
    .then((r) => r.json())
    .then(({ data }) => {
      if (Array.isArray(data[groupType])) {
        return data[groupType];
      }

      return [];
    });
};

export async function getPlaceholdersData(extra: {
  placeholders: Dictionary<string>;
  signal?: AbortSignal;
}) {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }
  const {
    url,
    actions: { placeholdersContent },
    hash,
    editorVersion: version
  } = config;

  const { placeholders, signal } = extra;

  const body = new URLSearchParams({
    hash,
    version,
    action: placeholdersContent
  });

  for (const [postId, placeholders_] of Object.entries(placeholders)) {
    if (placeholders_) {
      for (const p of placeholders_) {
        body.append(`p[${postId}][]`, p);
      }
    }
  }

  try {
    const r = await request(url, {
      method: "POST",
      body,
      signal
    }).then((r) => r.json());

    const { data } = r;
    const dc = Obj.readWithValueReader(Arr.readWithItemReader(Str.read))(
      data.placeholders
    );

    if (data.placeholders === undefined || dc === undefined) {
      throw new Error("fetch dynamic content error");
    }

    return dc;
  } catch (e) {
    throw new Error(`${e}`);
  }
}

//#endregion

//#region HeartBeat
export function sendHeartBeat(config: Config) {
  const {
    actions: { heartBeat },
    url: _url,
    hash,
    editorVersion: version
  } = config;

  const url = makeUrl(_url, {
    action: heartBeat,
    version,
    hash
  });
  return request(url, { method: "GET" }).then((r) => r.json());
}

export function sendHeartBeatTakeOver(config: Config) {
  const {
    actions: { takeOver },
    url: _url,
    hash,
    editorVersion: version
  } = config;

  const url = makeUrl(_url, {
    action: takeOver,
    version,
    hash
  });

  return request(url, { method: "GET" }).then((r) => r.json());
}

//#endregion

//#region fonts
export interface FontsData {
  id?: Literal;
  container: number;
  family: string;
  uid?: Literal;
  type: "uploaded";
  files: Record<string, string>;
  weights: Array<string>;
}

export async function getUploadedFonts() {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const {
    hash,
    url: _url,
    editorVersion: version,
    actions: { getFonts }
  } = config;

  const url = makeUrl(_url, {
    action: getFonts,
    version,
    hash
  });

  const r = await request(url, { method: "GET" });
  if (!r.ok) {
    throw new Error(t("Failed to fetch fonts"));
  }
  const response = await r.json();

  return response.data;
}

//#endregion

//#region Global Blocks

export const createGlobalBlock = async (
  globalBlock: GlobalBlock
): Promise<GlobalBlock> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { url, hash, actions, editorVersion } = config;
  const _url = makeUrl(url, {
    hash,
    action: actions.createGlobalBlock,
    version: editorVersion
  });
  const { uid, title, tags, data, position, rules, meta, status, compiled } =
    stringifyGlobalBlock(globalBlock);

  const body = new URLSearchParams({
    uid,
    data,
    rules,
    meta,
    status,
    ...(compiled && { compiled }),
    title: title ?? "",
    tags: tags ?? "",
    position: position ?? ""
  });

  try {
    const d = await persistentRequest<GlobalBlock>(_url, {
      method: "POST",
      body
    });
    if (!d.ok) {
      throw new Error(t("Failed to update Global blocks"));
    }

    return d.data;
  } catch (e) {
    throw new Error(t("Failed to update Global blocks"));
  }
};

export const updateGlobalBlock = async (
  globalBlock: GlobalBlock,
  extraMeta: { is_autosave?: 0 | 1 } = {}
): Promise<GlobalBlock> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }
  const { is_autosave = 1 } = extraMeta;
  const { url, hash, actions, editorVersion } = config;
  const _url = makeUrl(url, {
    hash,
    action: actions.updateGlobalBlock,
    version: editorVersion
  });

  const { uid, title, tags, data, position, rules, meta, status, compiled } =
    stringifyGlobalBlock(globalBlock);
  const body = new URLSearchParams({
    uid,
    data,
    rules,
    meta,
    status,
    ...(compiled && { compiled }),
    title: title ?? "",
    tags: tags ?? "",
    position: position ?? "",
    is_autosave: `${is_autosave}`
  });

  try {
    const d = await persistentRequest<GlobalBlock>(_url, {
      method: "POST",
      body
    });
    if (!d.ok) {
      throw new Error(t("Failed to update Global Block"));
    }
    return d.data;
  } catch {
    throw new Error(t("Failed to update Global Block"));
  }
};

export const updateGlobalBlocks = async (
  globalBlocks: Array<GlobalBlock>,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<Array<GlobalBlock>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }
  const { is_autosave = 1 } = meta;
  const { url, hash, actions, editorVersion } = config;
  const _url = makeUrl(url, {
    hash,
    action: actions.updateGlobalBlocks,
    version: editorVersion
  });
  const data = globalBlocks.reduce(
    (acc, globalBlock) => {
      const {
        uid,
        title,
        tags,
        data,
        position,
        rules,
        meta,
        status,
        compiled
      } = stringifyGlobalBlock(globalBlock);

      acc.uid.push(uid);
      acc.data.push(data);
      acc.status.push(status);
      acc.rules.push(rules);
      acc.meta.push(meta);
      acc.position.push(position ?? "");
      acc.title.push(title ?? "");
      acc.tags.push(tags ?? "");
      acc.compiled.push(compiled ?? "");

      return acc;
    },
    {
      uid: [],
      status: [],
      data: [],
      position: [],
      rules: [],
      meta: [],
      title: [],
      tags: [],
      media: [],
      compiled: []
    } as {
      uid: Array<string>;
      status: Array<string>;
      data: Array<string>;
      position: Array<string>;
      rules: Array<string>;
      meta: Array<string>;
      title: Array<string>;
      tags: Array<string>;
      media: Array<string>;
      compiled: Array<string>;
    }
  );

  const dataEncode = makeFormEncode({
    uid: data.uid,
    status: data.status,
    data: data.data,
    position: data.position,
    rules: data.rules,
    meta: data.meta,
    title: data.title,
    tags: data.tags,
    media: data.media,
    compiled: data.compiled,
    is_autosave: `${is_autosave}`
  });
  const body = new URLSearchParams(dataEncode);

  try {
    const d = await persistentRequest<Array<GlobalBlock>>(_url, {
      method: "POST",
      body
    });
    if (!d.ok) {
      throw new Error(t("Failed to update Global blocks"));
    }
    return d.data;
  } catch {
    throw new Error(t("Failed to update Global blocks"));
  }
};

//#endregion

//#region CustomIcon
export const getCustomIcons = async (): Promise<IconUploadData[]> => {
  const config = getConfig();
  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }
  const { api } = config;

  if (!api.iconsUrl) {
    throw new Error(t("Missing iconsUrl"));
  }

  const url = makeUrl(api.iconsUrl, {
    "orderBy[id]": "DESC",
    count: "1000"
  });

  const response = await request(url, {
    method: "GET"
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  throw new Error(t("Failed to get icons"));
};

export const uploadIcon = async (
  attachment: string,
  filename: string
): Promise<IconUploadData> => {
  const config = getConfig();
  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { api } = config;

  if (!api.uploadIconUrl) {
    throw new Error(t("Missing uploadIconUrl"));
  }

  const response = await request(api.uploadIconUrl, {
    method: "POST",
    body: new URLSearchParams({
      attachment,
      filename
    })
  });

  if (response.ok) {
    const { data } = await response.json();
    return data;
  }

  throw new Error(t("Failed to upload icon"));
};

export const deleteIcon = async (uid: string): Promise<Response> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { api } = config;

  if (!api.deleteIconUrl) {
    throw new Error(t("Missing deleteIconUrl"));
  }

  const response = await request(`${api.deleteIconUrl}${uid}`, {
    method: "DELETE"
  });

  if (response.ok) {
    return response;
  }

  throw new Error(t("Failed to delete icon"));
};
//#endregion

//#region AI Global Styles

export const getStyles = async (config: Config) => {
  const { aiGlobalStyleUrl } = config;

  return await fetch(`${aiGlobalStyleUrl}/api/template/style`).then((r) =>
    r.json()
  );
};

export const getTypography = async (config: Config) => {
  const { aiGlobalStyleUrl } = config;

  return await fetch(`${aiGlobalStyleUrl}/api/template/typography`).then((r) =>
    r.json()
  );
};

//#endregion

//#region Default Templates

export const getDefaultKits = async (
  url: string,
  id: string
): Promise<{
  blocks: Kit[];
  categories: { slug: string; title: string }[];
  styles: Style;
}> => {
  const fullUrl = makeUrl(url, {
    project_id: id
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    if (isT(res.collections) && isT(res.categories) && isT(res.styles)) {
      return {
        blocks: res.collections,
        categories: res.categories,
        styles: res.styles
      };
    }
  }

  throw new Error(t("Failed to load kits"));
};

export const getKitData = async (
  url: string,
  kitId: string,
  id: string
): Promise<DefaultBlock> => {
  const fullUrl = makeUrl(url, {
    project_id: kitId,
    page_slug: id
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    const res: KitDataResult = await response.json();

    const parsedResult = mPipe(
      pass(isKitDataResult),
      (s: KitDataResult) => s.collection.pop()?.pageData,
      (r) => Json.read(r),
      pass(isKitDataItems),
      Obj.readKey("items"),
      Arr.read,
      (res) => res[0]
    )(res);

    if (isT(parsedResult) && isDefaultBlock(parsedResult)) {
      return parsedResult;
    }
  }

  throw new Error(t("Failed to load kits"));
};

export const getKitsList = async (url: string): Promise<KitItem[]> => {
  const response = await request(url, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    if (Arr.is(res.collections)) {
      return res.collections.map((item: { slug: string; title: string }) => ({
        ...item,
        id: item.slug
      }));
    }
  }

  throw new Error(t("Failed to load kits"));
};

export const getDefaultLayouts = async (
  url: string
): Promise<{
  templates: LayoutsAPI[];
  categories: { slug: string; title: string }[];
}> => {
  const response = await request(url, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    if (res.collections && res.categories) {
      return { templates: res.collections, categories: res.categories };
    }
  }

  throw new Error(t("Failed to load layouts"));
};

export const getDefaultLayoutsPages = async (
  url: string,
  id: string
): Promise<LayoutsPagesResult> => {
  const fullUrl = makeUrl(url, {
    project_id: id,
    per_page: "20"
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(t("Failed to load layouts"));
};

export const getDefaultLayoutData = async (
  url: string,
  layoutId: Literal,
  id: string
): Promise<DefaultBlockWithID[]> => {
  const fullUrl = makeUrl(url, {
    project_id: layoutId as string,
    page_slug: id
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    const parsedResult = mPipe(
      pass(isLayoutDataResult),
      (res) => res.pop()?.pageData,
      (r) => JSON.parse(r),
      Obj.readKey("items")
    )(res);

    if (isT(parsedResult) && isDefaultBlockWithIDArray(parsedResult)) {
      return parsedResult;
    }
  }

  throw new Error(t("Failed to load layouts"));
};

export const getPopups = async (
  url: string
): Promise<{
  blocks: APIPopup[];
  categories: { slug: string; title: string }[];
}> => {
  const response = await request(url, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    if (isT(res) && isPopupsResponse(res)) {
      return { blocks: res.collections, categories: res.categories };
    }
  }

  throw new Error(t("Failed to load popups"));
};

export const getPopupData = async (
  url: string,
  id: string
): Promise<DefaultBlockWithID> => {
  const fullUrl = makeUrl(url, {
    project_id: id as string
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    const parsedResult = mPipe(
      pass(isPopupDataResult),
      (res) => res.pop()?.pageData,
      (r) => Json.read(r),
      pass(isKitDataItems),
      Obj.readKey("items"),
      Arr.read,
      (r) => r.pop()
    )(res);

    if (isT(parsedResult) && isDefaultBlockWithID(parsedResult)) {
      return parsedResult;
    }
  }

  throw new Error(t("Failed to load popups"));
};

export const getDefaultStories = async (
  url: string
): Promise<{
  templates: StoriesAPI[];
  categories: { slug: string; title: string }[];
}> => {
  const response = await request(url, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    if (res.collections && res.categories) {
      return { templates: res.collections, categories: res.categories };
    }
  }

  throw new Error(t("Failed to load stories"));
};

export const getDefaultStory = async (
  url: string,
  layoutId: Literal,
  id: string
): Promise<{
  blocks: DefaultBlock[];
}> => {
  const fullUrl = makeUrl(url, {
    project_id: `${layoutId}`,
    page_slug: id
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    const res = await response.json();

    const parsedResult = mPipe(
      pass(isStoryDataResponse),
      Obj.readKey("collection"),
      Json.read,
      pass(isStoryDataBlocks),
      pass(({ blocks }) => isDefaultBlockArray(blocks))
    )(res);

    if (parsedResult) {
      return parsedResult;
    }
  }

  throw new Error(t("Failed to load stories"));
};

export const getDefaultStoryPages = async (
  url: string,
  id: string
): Promise<StoryPagesResult> => {
  const fullUrl = makeUrl(url, {
    project_id: id,
    per_page: "20"
  });

  const response = await request(fullUrl, {
    method: "GET"
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(t("Failed to load stories"));
};

//#endregion
