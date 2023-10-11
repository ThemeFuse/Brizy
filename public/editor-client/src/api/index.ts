import { getConfig } from "../config";
import { Page } from "../types/Page";
import { Rule } from "../types/PopupConditions";
import { Project } from "../types/Project";
import { ResponseWithBody } from "../types/Response";
import {
  CreateSavedBlock,
  CreateSavedLayout,
  SavedBlock,
  SavedBlockMeta,
  SavedLayout,
  SavedLayoutMeta
} from "../types/SavedBlocks";
import { ScreenshotData } from "../types/Screenshots";
import { t } from "../utils/i18n";
import {
  editorRuleToApiRule,
  GetCollections,
  parseGlobalBlock,
  parseMetaSavedBlock,
  parseSavedBlock,
  parseSavedLayout,
  stringifyGlobalBlock,
  stringifyPage,
  stringifyProject,
  stringifySavedBlock
} from "./adapter";
import { makeFormEncode, makeUrl } from "./utils";
import {
  GlobalBlockNormal,
  GlobalBlockPopup,
  Rule as GBRule
} from "../types/GlobalBlocks";
import { MValue } from "../utils/types";

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
  const data = stringifyProject(project);
  const body = new URLSearchParams({
    data: data.data,
    dataVersion: data.dataVersion,
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(url, { method: "POST", body });
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
  const { data, dataVersion, title, tags, uid, meta, media } =
    stringifySavedBlock<CreateSavedLayout>(block);

  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
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

  const { uid, title, dataVersion } = savedLayout;
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
    dataVersion: `${dataVersion}`
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
  const { id, status, data, dataVersion } = stringifyPage(page);
  const body = new URLSearchParams({
    id,
    status,
    data,
    dataVersion: `${dataVersion}`,
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

//#region Global Blocks

export interface APIGlobalBlock {
  uid: string;
  data: string;
  meta: string;
  rules: string;
  position: string;
  dataVersion: number;
  status: string;
  dependencies: string;
  title?: string;
  tags?: string;
}

export const getGlobalBlocks = async (): Promise<Array<GlobalBlockNormal>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      action: actions.getGlobalBlockList,
      version: editorVersion
    })
  );

  try {
    const { data } = await persistentRequest<Array<Record<string, unknown>>>(
      url,
      { method: "GET" }
    );

    return data
      .map((block) => parseGlobalBlock(block))
      .filter((b): b is GlobalBlockNormal => b?.meta.type === "normal");
  } catch (e) {
    console.error(e);
    throw new Error(t("Failed to get Global blocks"));
  }
};

export const getGlobalBlocksByRules = async (
  rules: GBRule[]
): Promise<Array<GlobalBlockNormal>> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;
  const toAPiRule = rules.map(editorRuleToApiRule);

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      action: actions.getGlobalBlockListMatchingRules,
      version: editorVersion,
      rules: JSON.stringify(toAPiRule)
    })
  );

  const r = await request(url, { method: "GET" });
  const rj = await r.json();

  if (rj.success) {
    return rj.data
      .map((b: Record<string, unknown>) => parseGlobalBlock(b))
      .filter(
        (
          b: MValue<GlobalBlockNormal | GlobalBlockPopup>
        ): b is GlobalBlockNormal => b?.meta.type === "normal"
      );
  } else {
    throw rj;
  }
};

export const createGlobalBlock = async (
  globalBlock: GlobalBlockNormal
): Promise<GlobalBlockNormal> => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      action: actions.createGlobalBlock,
      version: editorVersion
    })
  );

  const uid = globalBlock.id;
  const {
    title = "",
    tags = "",
    data,
    rules,
    meta,
    status,
    dependencies
  } = stringifyGlobalBlock(globalBlock);
  // TODO: Need to be review
  // const media = makeBlockMeta(globalBlock);
  const body = new URLSearchParams({
    uid,
    data,
    rules,
    meta,
    title,
    tags,
    // media: JSON.stringify(media),
    status,
    dependencies
  });

  try {
    const r = await persistentRequest<APIGlobalBlock>(url, {
      method: "POST",
      body
    });
    return r.data;
  } catch {
    throw new Error(t("Failed to create Global block"));
  }
};

export const updateGlobalBlock = async (
  uid: string,
  globalBlock: GlobalBlockNormal,
  extraMeta: {
    is_autosave?: 1 | 0;
  } = {}
) => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      action: actions.updateGlobalBlock,
      version: editorVersion
    })
  );

  const { is_autosave = 1 } = extraMeta;
  const {
    title = "",
    tags = "",
    data,
    rules,
    meta,
    status,
    dependencies
  } = stringifyGlobalBlock(globalBlock);
  const body = new URLSearchParams({
    uid,
    status,
    data,
    rules,
    meta,
    dependencies,
    title,
    tags,
    is_autosave: `${is_autosave}`
  });

  try {
    return await persistentRequest(url, { method: "POST", body });
  } catch {
    throw new Error(t("Failed to update Global Block"));
  }
};

export const updateGlobalBlocks = async (
  globalBlocks: Record<string, GlobalBlockNormal>,
  extraMeta: {
    is_autosave?: 1 | 0;
  } = {}
) => {
  const config = getConfig();

  if (!config) {
    throw new Error(t("Invalid __BRZ_PLUGIN_ENV__"));
  }

  const { editorVersion, url: _url, hash, actions } = config;

  const url = makeUrl(
    _url,
    makeFormEncode({
      hash,
      action: actions.updateGlobalBlocks,
      version: editorVersion
    })
  );

  const { is_autosave = 1 } = extraMeta;
  const data = Object.entries(globalBlocks).reduce(
    (acc, [uid, globalBlock]) => {
      const {
        data,
        position,
        rules,
        meta,
        status,
        dependencies,
        title = "",
        tags = ""
      } = stringifyGlobalBlock(globalBlock);

      acc.uid.push(uid);
      acc.status.push(status);
      acc.data.push(data ?? "");
      acc.position.push(position);
      acc.rules.push(rules);
      acc.meta.push(meta);
      acc.title.push(title);
      acc.tags.push(tags);
      acc.dependencies.push(dependencies);

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
      dependencies: []
    } as {
      uid: string[];
      status: string[];
      data: string[];
      position: string[];
      rules: string[];
      meta: string[];
      title: string[];
      tags: string[];
      dependencies: string[];
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
    is_autosave: `${is_autosave}`
  });
  const body = new URLSearchParams(dataEncode);

  try {
    return await persistentRequest(url, { method: "POST", body });
  } catch {
    throw new Error(t("Failed to update Global blocks"));
  }
};

//#endregion

// export function getClasses(): Promise<unknown> {
//   const { url: _url, hash, getSymbols, editorVersion } = getConfig();
//   const url = makeUrl(_url, {
//     action: getSymbols,
//     version: editorVersion,
//     hash,
//   });
//
//   return request(url, { method: "GET" });
// }
