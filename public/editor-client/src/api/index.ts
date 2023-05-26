import { getConfig } from "../config";
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
import { t } from "../utils/i18n";
import {
  parseMetaSavedBlock,
  parseSavedBlock,
  parseSavedLayout,
  stringifySavedBlock
} from "./adapter";
import { makeFormEncode } from "./utils";
import { stringifyProject } from "./adapter";

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

export const makeUrl = (
  baseUrl: string,
  params: Record<string, string> = {}
): string => {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

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

  const { uid, title, tags, dataVersion } = savedBlock;
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

  const { uid, title, tags, dataVersion } = savedLayout;
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
