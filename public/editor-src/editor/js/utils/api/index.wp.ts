import { ChoicesAsync } from "visual/component/Options/types/dev/Select/types";
import Config, { WP } from "visual/global/Config";
import {
  AutoSave,
  ConfigCommon,
  CreateSavedBlock,
  CreateSavedLayout,
  DeleteSavedBlock,
  DeleteSavedLayout,
  OnChange,
  PublishData,
  SavedBlockAPIMeta,
  SavedBlockFilter,
  SavedBlockImport,
  SavedLayoutAPIMeta,
  SavedLayoutFilter,
  SavedLayoutImport,
  UpdateSavedBlock,
  UpdateSavedLayout
} from "visual/global/Config/types/configs/ConfigCommon";
import {
  CloudPopup,
  GlobalBlock,
  PageWP,
  Rule,
  SavedBlock,
  SavedLayout
} from "visual/types";
import { GlobalBlocksError, PageError } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import * as Arr from "visual/utils/reader/array";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import {
  apiRuleToEditorRule,
  editorRuleToApiRule,
  makeBlockMeta,
  parseGlobalBlock,
  parsePageWP,
  stringifyGlobalBlock,
  stringifyPage
} from "./adapter";
import {
  CreateScreenshot,
  GetAuthors,
  GetDynamicContent,
  GetPostTaxonomies,
  GetPosts,
  GetPostsSourceRefs,
  GetRulePostsGroupList,
  GetTerms,
  GetTermsBy,
  GetWPCollectionSourceItems,
  GetWPCollectionSourceTypes,
  ResponseWithBody,
  UpdateScreenshot
} from "./types";
import { makeFormEncode, makeUrl } from "./utils";

export { makeFormEncode, makeUrl };

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

//#region Publish

export function publish(
  data: PublishData,
  config: ConfigCommon
): Promise<PublishData> {
  return new Promise((res, rej) => {
    const { handler } = config.ui?.publish ?? {};

    if (!handler) {
      rej(t("API: No publish handler found."));
    } else {
      handler(res, rej, data);
    }
  });
}

//#endregion

//#region AutoSave

export function autoSave(data: AutoSave, config: ConfigCommon): Promise<void> {
  return new Promise((res) => {
    config.onAutoSave?.(data);
    res();
  });
}

//#endregion

//#region OnChange

export function onChange(data: OnChange, config: ConfigCommon): Promise<void> {
  return new Promise((res) => {
    config.onChange?.(data);
    res();
  });
}

//#endregion

//#region Project

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

export const getSavedBlocks = async (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const get = savedBlocks?.get;

    if (!get) {
      rej(t("API: No savedBlocks get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedBlockById = (
  uid: string,
  config: ConfigCommon
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const getSavedBlockById = savedBlocks?.getByUid;

    if (!getSavedBlockById) {
      rej(t("API: No savedBlocks getByUid found."));
    } else {
      getSavedBlockById(res, rej, { uid });
    }
  });
};

interface _SavedBlock extends SavedBlock {
  uid: string;
}

export const createSavedBlock = (
  block: _SavedBlock,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const create = savedBlocks?.create;

    if (!create) {
      rej(t("API: No savedBlocks create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedBlock = {
        block: { ...block, media: makeBlockMeta(block) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedBlock = (
  savedBlock: DeleteSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const deleteSavedBlock = savedBlocks?.delete;

    if (!deleteSavedBlock) {
      rej(t("API: No savedBlocks delete found."));
    } else {
      deleteSavedBlock(res, rej, savedBlock);
    }
  });
};

export const updateSavedBlock = (
  savedBlock: UpdateSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const updateSavedBlock = savedBlocks?.update;

    if (!updateSavedBlock) {
      rej(t("API: No savedBlocks update found."));
    } else {
      updateSavedBlock(res, rej, savedBlock);
    }
  });
};

export const importSaveBlocks = async (
  config: ConfigCommon
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const importSavedBlocks = savedBlocks?.import;

    if (!importSavedBlocks) {
      rej(t("API: No savedBlocks upload found."));
    } else {
      importSavedBlocks(res, rej);
    }
  });
};

export const filterSavedBlocks = (
  config: ConfigCommon
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedBlocks } = config.api ?? {};
    const filterSavedBlocks = savedBlocks?.filter?.handler;

    if (!filterSavedBlocks) {
      rej(t("API: No savedBlocks filter found."));
    } else {
      filterSavedBlocks(res, rej);
    }
  });
};

//#endregion

//#region Saved popups

export const getSavedPopups = async (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedBlockAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const get = savedPopups?.get;

    if (!get) {
      rej(t("API: No savedPopups get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedPopupById = (
  uid: string,
  config: ConfigCommon
): Promise<SavedBlock> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const getSavedPopupById = savedPopups?.getByUid;

    if (!getSavedPopupById) {
      rej(t("API: No savedPopups getByUid found."));
    } else {
      getSavedPopupById(res, rej, { uid });
    }
  });
};

interface _SavedPopup extends SavedBlock {
  uid: string;
}

export const createSavedPopup = (
  block: _SavedPopup,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const create = savedPopups?.create;

    if (!create) {
      rej(t("API: No savedPopups create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedBlock = {
        block: { ...block, media: makeBlockMeta(block) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedPopup = (
  savedBlock: DeleteSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const deleteSavedPopup = savedPopups?.delete;

    if (!deleteSavedPopup) {
      rej(t("API: No savedPopup delete found."));
    } else {
      deleteSavedPopup(res, rej, savedBlock);
    }
  });
};

export const updateSavedPopup = (
  savedBlock: UpdateSavedBlock,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const updateSavedPopup = savedPopups?.update;

    if (!updateSavedPopup) {
      rej(t("API: No savedPopup update found."));
    } else {
      updateSavedPopup(res, rej, savedBlock);
    }
  });
};

export const importSavePopups = async (
  config: ConfigCommon
): Promise<SavedBlockImport> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const importSavedPopups = savedPopups?.import;

    if (!importSavedPopups) {
      rej(t("API: No savedPopups import found."));
    } else {
      importSavedPopups(res, rej);
    }
  });
};

export const filterSavedPopups = (
  config: ConfigCommon
): Promise<SavedBlockFilter> => {
  return new Promise((res, rej) => {
    const { savedPopups } = config.api ?? {};
    const filterSavedPopups = savedPopups?.filter?.handler;

    if (!filterSavedPopups) {
      rej(t("API: No savedPopups filter found."));
    } else {
      filterSavedPopups(res, rej);
    }
  });
};

//#endregion

//#region Saved layouts

export const getSavedLayouts = (
  config: ConfigCommon,
  filter?: { filterBy: string }
): Promise<Array<SavedLayoutAPIMeta>> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const get = savedLayouts?.get;

    if (!get) {
      rej(t("API: No savedLayouts get found."));
    } else {
      get(res, rej, filter);
    }
  });
};

export const getSavedLayoutById = (
  id: string,
  config: ConfigCommon
): Promise<SavedLayout> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const getByUid = savedLayouts?.getByUid;

    if (!getByUid) {
      rej(t("API: No savedLayouts getByUid found."));
    } else {
      getByUid(res, rej, { uid: id });
    }
  });
};

interface _Layout extends SavedLayout {
  uid: string;
}

export const createSavedLayout = (
  layout: _Layout,
  config: ConfigCommon,
  meta?: { is_autosave: 0 | 1 }
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const create = savedLayouts?.create;

    if (!create) {
      rej(t("API: No savedLayouts create found."));
    } else {
      const { is_autosave = 0 } = meta ?? {};
      const data: CreateSavedLayout = {
        block: { ...layout, media: makeBlockMeta(layout) },
        is_autosave
      };

      create(res, rej, data);
    }
  });
};

export const deleteSavedLayout = (
  savedLayout: DeleteSavedLayout,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const deleteSavedLayout = savedLayouts?.delete;

    if (!deleteSavedLayout) {
      rej(t("API: No savedLayout delete found."));
    } else {
      deleteSavedLayout(res, rej, savedLayout);
    }
  });
};

export const updateSavedLayout = (
  savedLayout: UpdateSavedLayout,
  config: ConfigCommon
) => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const updateSavedLayout = savedLayouts?.update;

    if (!updateSavedLayout) {
      rej(t("API: No savedLayout update found."));
    } else {
      updateSavedLayout(res, rej, savedLayout);
    }
  });
};

export const importSavedLayout = (
  config: ConfigCommon
): Promise<SavedLayoutImport> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const importSavedLayout = savedLayouts?.import;

    if (!importSavedLayout) {
      rej(t("API: No savedLayout import found."));
    } else {
      importSavedLayout(res, rej);
    }
  });
};

export const filterSavedLayouts = (
  config: ConfigCommon
): Promise<SavedLayoutFilter> => {
  return new Promise((res, rej) => {
    const { savedLayouts } = config.api ?? {};
    const filterSavedLayouts = savedLayouts?.filter?.handler;

    if (!filterSavedLayouts) {
      rej(t("API: No savedLayouts filter found."));
    } else {
      filterSavedLayouts(res, rej);
    }
  });
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
    media: JSON.stringify(media),
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

export async function getAttachmentById(id: string): Promise<{ uid: string }> {
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
/////
/////
///// getPostObjects is not used, need to review if is needed to delete or leave it for future
/////
/////
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
export const uploadFile = (): Promise<string> => {
  return Promise.reject("Not implemented");
};

export const getSourceIds = (
  type: string,
  config: ConfigCommon
): ChoicesAsync["load"] => {
  const sourceItemsHandler = config?.api?.sourceItems?.handler;

  return () => {
    return new Promise((res, rej) => {
      if (typeof sourceItemsHandler === "function") {
        sourceItemsHandler(res, rej, { id: type });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
};
