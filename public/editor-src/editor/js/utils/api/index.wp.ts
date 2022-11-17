import Config, { WP } from "visual/global/Config";
import { ReduxState } from "visual/redux/types";
import { CloudPopup, GlobalBlock, PageWP, Rule } from "visual/types";
import { paginationData } from "visual/utils/api/const";
import {
  GlobalBlocksError,
  PageError,
  ProjectError
} from "visual/utils/errors";
import * as Arr from "visual/utils/reader/array";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import {
  apiRuleToEditorRule,
  editorRuleToApiRule,
  makeBlockMeta,
  parseGlobalBlock,
  parseMetaSavedBlock,
  parsePageWP,
  parseProject,
  parseSavedBlock,
  parseSavedLayout,
  stringifyGlobalBlock,
  stringifyPage,
  stringifyProject,
  stringifySavedBlock
} from "./adapter";
import {
  CreateSavedBlock,
  CreateSavedLayout,
  CreateScreenshot,
  DeleteSavedBlockById,
  DeleteSavedLayoutById,
  GetAuthors,
  GetDynamicContent,
  GetPosts,
  GetPostsSourceRefs,
  GetPostTaxonomies,
  GetRulePostsGroupList,
  GetSavedBlockById,
  GetSavedBlocksMeta,
  GetSavedLayoutById,
  GetSavedLayoutsMeta,
  GetTerms,
  GetTermsBy,
  GetWPCollectionSourceItems,
  GetWPCollectionSourceTypes,
  ResponseWithBody,
  UpdateScreenshot,
  UploadSavedBlocks,
  UploadSavedLayouts,
  UploadSavedPopups
} from "./types";
import { makeFormEncode, makeUrl } from "./utils";
export { makeFormEncode, makeUrl };

type Project = ReduxState["project"];

//#region Common Utils Request & PersistentRequest
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

export function pendingRequest(time = 650): Promise<boolean> {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

//#endregion

//#region Project

export function getProject(): Promise<Project> {
  const {
    wp: {
      api: { url: _url, hash, getProject }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    action: getProject,
    version: editorVersion,
    hash
  });

  return persistentRequest(url, {
    method: "GET"
  })
    .then(({ data }) => data)
    .then(parseProject)
    .catch(() => {
      throw new ProjectError("Failed to get Project");
    });
}

export function updateProject(
  project: Project,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const {
    wp: {
      api: { url: _url, hash, setProject }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    action: setProject,
    version: editorVersion,
    hash
  });
  const { is_autosave = 1 } = meta;
  const { data, dataVersion } = stringifyProject(project);
  const body = new URLSearchParams({
    data,
    dataVersion: `${dataVersion}`,
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(url, {
    method: "POST",
    body
  }).catch(() => {
    throw new ProjectError("Failed to update project");
  });
}

export function addProjectLockedBeacon(): Promise<unknown> {
  const { url, hash, lockProject } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      version,
      hash,
      action: lockProject
    })
  })
    .then((r) => r.json())
    .then((rj) => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}

export function removeProjectLockedSendBeacon(): boolean {
  const { removeLock, url: apiUrl } = Config.get("wp").api;
  const version = Config.get("editorVersion");
  const url = new URL(apiUrl);

  url.searchParams.append("action", removeLock);
  url.searchParams.append("version", version);

  return navigator.sendBeacon(`${url}`);
}

//#endregion

//#region Page

export function getPages(): Promise<PageWP[]> {
  const {
    wp: {
      page,
      api: { url: _url, hash, getPage }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    action: getPage,
    version: editorVersion,
    hash,
    id: page
  });

  return persistentRequest<unknown[]>(url, {
    method: "GET"
  })
    .then(({ data }) => data.map(parsePageWP))
    .catch(() => {
      throw new PageError("Failed to get page");
    });
}

export function getPage(pageId: number): Promise<PageWP | undefined> {
  return getPages().then((pages) => pages.find((p) => p.id === `${pageId}`));
}

export function updatePage(
  page: PageWP,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<{ data: PageWP }> {
  const {
    wp: {
      api: { url: _url, hash, updatePage }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    action: updatePage,
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

  return persistentRequest<PageWP>(url, {
    method: "POST",
    body
  }).catch(() => {
    throw new PageError("Failed to update page");
  });
}

//#endregion

//#region Dynamic Content

export const getDynamicContent: GetDynamicContent = async ({
  placeholders,
  signal
}) => {
  const {
    api: { url, hash, placeholdersContent }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
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

  const r = await request(url, {
    method: "POST",
    body,
    signal
  });

  if (!r.ok) {
    throw new Error("fetch dynamic content error");
  }

  const { data } = await r.json();

  if (data === undefined || data.placeholders === undefined) {
    throw new Error("fetch dynamic content error");
  }

  const dc = Obj.readWithValueReader(Arr.readWithItemReader(Str.read))(
    data.placeholders
  );

  if (dc === undefined) {
    throw new Error("fetch dynamic content error");
  }

  return dc;
};

//#endregion

//#region Screenshots

export const createBlockScreenshot: CreateScreenshot = ({
  base64,
  blockType
}) => {
  const {
    page,
    api: { url, hash, createBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: createBlockScreenshot,
      post: page,
      version,
      hash,
      block_type: blockType,
      ibsf: attachment // ibsf - image base64
    })
  })
    .then((r) => r.json())
    .then((rj) => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
};

export const updateBlockScreenshot: UpdateScreenshot = ({
  id,
  base64,
  blockType
}) => {
  const {
    page,
    api: { url, hash, updateBlockScreenshot }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: updateBlockScreenshot,
      post: page,
      version,
      hash,
      block_type: blockType,
      id,
      ibsf: attachment
    })
  })
    .then((r) => r.json())
    .then((rj) => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
};

//#endregion

//#region Saved blocks

export const getSavedBlocks: GetSavedBlocksMeta = (pagination) => {
  const {
    wp: {
      api: { url: _url, hash, getSavedBlockList }
    },
    editorVersion
  } = Config.getAll() as WP;
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
      action: getSavedBlockList,
      version: editorVersion,
      fields: ["uid", "meta", "synchronized", "synchronizable"]
    })
  );

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedBlockById: GetSavedBlockById = (uid) => {
  const {
    wp: {
      api: { url: _url, hash, getSavedBlockByUid }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    uid,
    hash,
    action: getSavedBlockByUid,
    version: editorVersion
  });

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(({ data }) => parseSavedBlock(data));
};

export const createSavedBlock: CreateSavedBlock = (savedBlock) => {
  const {
    wp: {
      api: { url: _url, hash, createSavedBlock }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: createSavedBlock,
    version: editorVersion
  });
  const { uid, data, dataVersion, meta } = stringifySavedBlock(savedBlock);
  const media = makeBlockMeta(savedBlock);
  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
    dataVersion: `${dataVersion}`
  });

  return persistentRequest(url, {
    method: "POST",
    body
  });
};

export const deleteSavedBlock: DeleteSavedBlockById = (uid) => {
  const {
    wp: {
      api: { url: _url, hash, deleteSavedBlock }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    action: deleteSavedBlock,
    version: editorVersion,
    hash,
    uid
  });

  return request(url, {
    method: "DELETE"
  });
};

export const uploadSaveBlocks: UploadSavedBlocks = async (files) => {
  const config = Config.getAll() as WP;
  const {
    api: { url, hash, uploadBlocks }
  } = config.wp;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  formData.append("version", version);
  formData.append("hash", hash);
  formData.append("action", uploadBlocks);

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

//#region Saved popups

export const uploadSavePopups: UploadSavedPopups = async (files) => {
  const config = Config.getAll() as WP;
  const {
    api: { url, hash, uploadBlocks }
  } = config.wp;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  formData.append("version", version);
  formData.append("hash", hash);
  formData.append("action", uploadBlocks);

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

//#region Saved layouts

export const getSavedLayouts: GetSavedLayoutsMeta = (pagination) => {
  const {
    wp: {
      api: { url: _url, hash, getLayoutList }
    },
    editorVersion
  } = Config.getAll() as WP;
  const {
    count,
    page,
    orderBy = "id",
    order = "ASC"
  } = pagination || paginationData;

  const url = makeUrl(
    _url,
    makeFormEncode({
      action: getLayoutList,
      hash,
      orderBy,
      order,
      count,
      page,
      version: editorVersion,
      fields: ["uid", "meta", "synchronized", "synchronizable"]
    })
  );

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(({ data }) => data.map(parseMetaSavedBlock));
};

export const getSavedLayoutById: GetSavedLayoutById = (uid) => {
  const {
    wp: {
      api: { url: _url, hash, getLayoutByUid }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    uid,
    action: getLayoutByUid,
    version: editorVersion
  });

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(({ data }) => parseSavedLayout(data));
};

export const createSavedLayout: CreateSavedLayout = (savedLayout) => {
  const {
    wp: {
      api: { url: _url, hash, createLayout }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: createLayout,
    version: editorVersion
  });
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedLayout);
  const media = makeBlockMeta(savedLayout);
  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
    dataVersion: `${dataVersion}`
  });

  return persistentRequest(url, {
    method: "POST",
    body
  });
};

export const deleteSavedLayout: DeleteSavedLayoutById = (uid) => {
  const {
    wp: {
      api: { url: _url, hash, deleteLayout }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    uid,
    action: deleteLayout,
    version: editorVersion
  });

  return request(url, {
    method: "DELETE"
  });
};

export const uploadSaveLayouts: UploadSavedLayouts = async (files) => {
  const config = Config.getAll() as WP;
  const {
    api: { url, hash, uploadBlocks }
  } = config.wp;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  formData.append("version", version);
  formData.append("hash", hash);
  formData.append("action", uploadBlocks);

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

//#region Rules

export function updatePopupRules(popup: CloudPopup): Promise<unknown> {
  const {
    api: { updateRules, hash, url },
    page
  } = Config.get("wp");
  const { rules, dataVersion } = popup;
  const version = Config.get("editorVersion");

  return request(
    `${url}?action=${updateRules}&hash=${hash}&post=${page}&version=${version}&dataVersion=${dataVersion}`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rules.map(editorRuleToApiRule))
    }
  );
}

export function getRulesList(): Promise<Rule> {
  const {
    api: { getRuleList, hash, url },
    page
  } = Config.get("wp");
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: getRuleList,
      post: page,
      version,
      hash
    })
  })
    .then((r) => r.json())
    .then(({ data }) => data.map(apiRuleToEditorRule));
}

export async function getGroupList(type: "block" | "popup"): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getRuleGroupList }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getRuleGroupList,
    context: type === "popup" ? "popup-rules" : "global-block-rules"
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

//#region Global Blocks

export function getGlobalBlocks(): Promise<Record<string, GlobalBlock>> {
  const {
    wp: {
      api: { url: _url, hash, getGlobalBlockList }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: getGlobalBlockList,
    version: editorVersion
  });
  type GlobalBlocks = Array<{
    data: string;
    meta: string;
    rules: string;
    position: string;
    status: string;
  }>;

  return persistentRequest<GlobalBlocks>(url, {
    method: "GET"
  })
    .then(({ data }) => {
      return data
        .map(parseGlobalBlock)
        .reduce((acc, { uid, data, status, rules, position, meta }) => {
          // was commented because of this cases:
          // add block to page -> Update the page -> refresh it ->
          // make block global -> refresh the page -> make the same block global again
          // if (status === "draft") return acc;

          acc[uid] = {
            data,
            status,
            meta,
            rules,
            position,
            id: uid
          };

          return acc;
        }, {});
    })
    .catch(() => {
      throw new GlobalBlocksError("Failed to get Global blocks");
    });
}

export function createGlobalBlock(
  globalBlock: GlobalBlock
): Promise<{ data: string; meta: string; dataVersion: string }> {
  const {
    wp: {
      api: { url: _url, hash, createGlobalBlock }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: createGlobalBlock,
    version: editorVersion
  });

  const uid = globalBlock.data.value._id;
  const { data, rules, meta } = stringifyGlobalBlock(globalBlock);
  const media = makeBlockMeta(globalBlock);
  const body = new URLSearchParams({
    uid,
    data,
    rules,
    meta,
    media,
    status: "draft"
  });
  type GlobalBlock = {
    data: string;
    meta: string;
    dataVersion: string;
    id: number;
  };

  return persistentRequest<GlobalBlock>(url, {
    method: "POST",
    body
  })
    .then((r) => r.data)
    .catch(() => {
      throw new GlobalBlocksError("Failed to create Global block");
    });
}

export function updateGlobalBlock(
  uid: string,
  globalBlock: GlobalBlock,
  extraMeta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const {
    wp: {
      api: { url: _url, hash, updateGlobalBlock }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: updateGlobalBlock,
    version: editorVersion
  });

  const { is_autosave = 1 } = extraMeta;
  // const uid = globalBlock.data.value._id;
  const { data, rules, meta, status } = stringifyGlobalBlock(globalBlock);
  const body = new URLSearchParams({
    uid,
    status,
    data,
    rules,
    meta,
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(url, {
    method: "POST",
    body
  }).catch(() => {
    throw new PageError("Failed to update Global Block");
  });
}

export function updateGlobalBlocks(
  globalBlocks: Record<string, GlobalBlock>,
  extraMeta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const {
    wp: {
      api: { url: _url, hash, updateGlobalBlocks }
    },
    editorVersion
  } = Config.getAll() as WP;
  const url = makeUrl(_url, {
    hash,
    action: updateGlobalBlocks,
    version: editorVersion
  });

  const { is_autosave = 1 } = extraMeta;
  const data = Object.entries(globalBlocks).reduce(
    (acc, [uid, globalBlock]) => {
      const { data, position, rules, meta, status } =
        stringifyGlobalBlock(globalBlock);

      acc.uid.push(uid);
      acc.status.push(status);
      acc.data.push(data ?? "");
      acc.position.push(JSON.stringify(position));
      acc.rules.push(rules);
      acc.meta.push(meta);

      return acc;
    },
    {
      uid: [],
      status: [],
      data: [],
      position: [],
      rules: [],
      meta: []
    } as {
      uid: string[];
      status: string[];
      data: string[];
      position: string[];
      rules: string[];
      meta: string[];
    }
  );
  const dataEncode = makeFormEncode({
    uid: data.uid,
    status: data.status,
    data: data.data,
    position: data.position,
    rules: data.rules,
    meta: data.meta,
    is_autosave: `${is_autosave}`
  });
  const body = new URLSearchParams(dataEncode);

  return persistentRequest(url, {
    method: "POST",
    body
  }).catch(() => {
    throw new PageError("Failed to update Global blocks");
  });
}

//#endregion

//#region Image

export async function getImageUid(id: string): Promise<{ uid: string }> {
  const {
    editorVersion,
    wp: {
      page,
      api: { url, hash, getMediaUid }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getMediaUid,
    post_id: page,
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

//#region Featured Image

export async function updateFeaturedImage(
  post: string,
  attachmentId: string
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, setFeaturedImage }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: setFeaturedImage,
    post: post,
    attachmentId: attachmentId
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

export async function updateFeaturedImageFocalPoint(
  post: string,
  attachmentId: string,
  pointX: string,
  pointY: string
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, setFeaturedImageFocalPoint }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: setFeaturedImageFocalPoint,
    post: post,
    attachmentId: attachmentId,
    pointX: pointX,
    pointY: pointY
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

export async function removeFeaturedImage(post: string): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, removeFeaturedImage }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: removeFeaturedImage,
    post
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

//#region Sidebars

export async function getSidebars(): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getSidebars }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getSidebars
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

//#region Shortcode Content

export async function shortcodeContent(shortcode: string): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, shortcodeContent }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: shortcodeContent,
    shortcode
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

//#region GetMenus

export async function getMenus(): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getMenus }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getMenus
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

//#region Fonts

export async function getUploadedFonts(): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getFonts }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getFonts
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

//#region Attachment byId

export async function getAttachmentById(id: string): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getAttachmentUid }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getAttachmentUid,
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

//#region HeartBeat

export function sendHeartBeat(): Promise<unknown> {
  const { url, hash, heartBeat } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: heartBeat,
      version,
      hash
    })
  })
    .then((r) => r.json())
    .then((rj) => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}

export function sendHearBeatTakeOver(): Promise<unknown> {
  const { url, hash, takeOver } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: takeOver,
      version,
      hash
    })
  })
    .then((r) => r.json())
    .then((rj) => {
      if (rj.success) {
        return rj.data;
      }

      throw rj;
    });
}

//#endregion

//#region GetPostObjects

export async function getPostObjects(postType: string): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getPostObjects }
    }
  } = Config.getAll() as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: getPostObjects,
    postType
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

export const getAuthors: GetAuthors = async ({
  include = [],
  search = "",
  abortSignal
} = {}) => {
  const {
    api: { url, hash, getUsers }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: getUsers
  });

  if (search !== "") {
    body.append("search", search);
  }
  for (const i of include) {
    body.append("include[]", i);
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

export const getTerms: GetTerms = async (taxonomy) => {
  const { url, hash, getTerms } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({ hash, version, taxonomy, action: getTerms })
  })
    .then((r) => r.json())
    .then(({ data }) => data);
};

export const getTermsBy: GetTermsBy = async ({
  include = [],
  search = "",
  abortSignal
} = {}) => {
  const {
    api: { url, hash, getTermsBy }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: getTermsBy
  });

  if (search !== "") {
    body.append("search", search);
  }
  for (let i = 0; i < include.length; i++) {
    const [taxonomy, termId] = include[i];

    body.append("taxonomy[]", taxonomy);
    body.append("include[]", termId);
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

export const getPosts: GetPosts = async ({
  include,
  search = "",
  postType,
  excludePostType,
  abortSignal
} = {}) => {
  const {
    api: { url, hash, searchPosts }
  } = Config.get("wp");
  const version = Config.get("editorVersion");
  const body = new URLSearchParams({
    hash,
    version,
    action: searchPosts
  });

  if (search !== "") {
    body.append("search", search);
  }
  if (include !== undefined) {
    for (const i of include) {
      body.append("include[]", i);
    }
  }
  if (postType !== undefined) {
    for (const p of postType) {
      body.append("post_type[]", p);
    }
  }
  if (excludePostType !== undefined) {
    for (const p of excludePostType) {
      body.append("exclude_post_type[]", p);
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

export const getPostTaxonomies: GetPostTaxonomies = async ({
  taxonomy,
  abortSignal
}) => {
  const { url, hash, getPostTaxonomies } = Config.get("wp").api;
  const version = Config.get("editorVersion");

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version,
      post_type: taxonomy,
      action: getPostTaxonomies
    }),
    signal: abortSignal
  })
    .then((r) => r.json())
    .then(({ data }) => data)
    .catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }
      return [];
    });
};

export const getCollectionSourceTypes: GetWPCollectionSourceTypes =
  async () => {
    const config = Config.getAll() as WP;

    const data = config.wp.postTypes;

    return Promise.resolve(data);
  };

export const getCollectionSourceItems: GetWPCollectionSourceItems = async (
  id
) => {
  const config = Config.getAll() as WP;

  const { wp, editorVersion } = config;
  const { url, hash, getPostObjects } = wp.api;

  return await request(url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version: editorVersion,
      postType: id,
      action: getPostObjects
    })
  })
    .then((r) => r.json())
    .then((result) => {
      if (!result?.data) {
        throw "Something went wrong";
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

//#region Rules

export const getRulePostsGroupList: GetRulePostsGroupList = async (
  postType
) => {
  const config = Config.getAll() as WP;
  const { wp, editorVersion } = config;
  const { url, hash, rulePostsGroupList } = wp.api;

  return await request(url, {
    method: "POSt",
    body: new URLSearchParams({
      hash,
      version: editorVersion,
      action: rulePostsGroupList,
      postType
    })
  })
    .then((r) => r.json())
    .then((result) => {
      if (!result?.data) {
        throw "Something went wrong";
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

//#region Posts

export const getPostsSourceRefs: GetPostsSourceRefs = () => {
  return Promise.reject("not implemented");
};

//#endregion

// is needed to pass webpack warnings
export const uploadImage = (): Promise<string> => {
  return Promise.reject("Not implemented");
};
export const uploadFile = (): Promise<string> => {
  return Promise.reject("Not implemented");
};
