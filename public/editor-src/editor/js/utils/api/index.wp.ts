import Config, { WP } from "visual/global/Config";
import { Rule } from "visual/types";
import { apiRuleToEditorRule } from "visual/utils/reader/globalBlocks";
import {
  GetAuthors,
  GetPosts,
  GetPostTaxonomies,
  GetRulePostsGroupList,
  GetTerms,
  GetTermsBy,
  GetWPCollectionSourceItems,
  GetWPCollectionSourceTypes
} from "./types";
import { makeFormEncode, makeUrl } from "./utils";

export {
  addCustomIcon,
  autoSave,
  createBlockScreenshot,
  createGlobalBlock,
  createGlobalPopup,
  createSavedBlock,
  createSavedLayout,
  createSavedPopup,
  defaultKits,
  defaultKitsData,
  defaultKitsMeta,
  defaultLayoutPages,
  defaultLayoutsData,
  defaultLayoutsMeta,
  defaultPopupsData,
  defaultPopupsMeta,
  defaultPostsSources,
  defaultStoriesData,
  defaultStoriesMeta,
  defaultStoriesPages,
  deleteCustomIcon,
  deleteSavedBlock,
  deleteSavedLayout,
  deleteSavedPopup,
  filterSavedBlocks,
  filterSavedLayouts,
  filterSavedPopups,
  getAdobeFonts,
  getCollectionItems,
  getCollectionTypes,
  getCustomIcons,
  getDynamicContent,
  getEcwidProducts,
  getGlobalColors,
  getGlobalTypography,
  getLeadificCustomFields,
  getSavedBlockById,
  getSavedBlocks,
  getSavedLayoutById,
  getSavedLayouts,
  getSavedPopupById,
  getSavedPopups,
  getUploadedFonts,
  importSaveBlocks,
  importSavedLayout,
  importSavePopups,
  onChange,
  pendingRequest,
  publish,
  sendHeartBeat,
  sendHeartBeatTakeOver,
  updateBlockScreenshot,
  updatePopupRules,
  updateSavedBlock,
  updateSavedLayout,
  updateSavedPopup
} from "./common";
export { makeFormEncode, makeUrl };

//#region Common Utils Request

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

//#endregion

//#region Rules

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

//#region Pass webpack warnings

export function getCollectionTypesWithFields() {
  return Promise.reject("Not implemented");
}

export const uploadFile = (): Promise<string> => {
  return Promise.reject("Not implemented");
};

export const getMetafields = () => {
  return Promise.reject("Not implemented");
};

export const getBlogPostMeta = () => {
  return Promise.reject("Not implemented");
};

//#endregion
