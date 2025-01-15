import { Str } from "@brizy/readers";
import { WP } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Rule } from "visual/types";
import { apiRuleToEditorRule } from "visual/utils/reader/globalBlocks";
import {
  GetAuthors,
  GetPostTaxonomies,
  GetPosts,
  GetRulePostsGroupList,
  GetTerms,
  GetTermsBy
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
export function getRulesList(config: ConfigCommon): Promise<Rule> {
  const wpConfig = config as WP;
  const {
    api: { getRuleList, hash, url },
    page
  } = wpConfig.wp;
  const version = wpConfig.editorVersion;

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      action: Str.read(getRuleList) ?? "",
      post: page,
      version,
      hash
    })
  })
    .then((r) => r.json())
    .then(({ data }) => data.map(apiRuleToEditorRule));
}

export async function getGroupList(
  type: "block" | "popup",
  config: ConfigCommon
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getRuleGroupList }
    }
  } = config as WP;

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

//#region Featured Image
export async function updateFeaturedImage(
  attachmentId: string,
  config: ConfigCommon
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      page: post,
      api: { url, hash, setFeaturedImage }
    }
  } = config as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: setFeaturedImage,
    post,
    attachmentId
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
  attachmentId: string,
  pointX: string,
  pointY: string,
  config: ConfigCommon
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      page: post,
      api: { url, hash, setFeaturedImageFocalPoint }
    }
  } = config as WP;

  const body = new URLSearchParams({
    hash,
    version: editorVersion,
    action: setFeaturedImageFocalPoint,
    post,
    attachmentId,
    pointX,
    pointY
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

export async function removeFeaturedImage(
  config: ConfigCommon
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      page: post,
      api: { url, hash, removeFeaturedImage }
    }
  } = config as WP;

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
export async function getSidebars(config: ConfigCommon): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getSidebars }
    }
  } = config as WP;

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

export async function shortcodeContent(
  shortcode: string,
  config: ConfigCommon
): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, shortcodeContent }
    }
  } = config as WP;

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

export async function getMenus(config: ConfigCommon): Promise<unknown> {
  const {
    editorVersion,
    wp: {
      api: { url, hash, getMenus }
    }
  } = config as WP;

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

export const getAuthors: GetAuthors = async ({
  include = [],
  search = "",
  abortSignal,
  config
}) => {
  const {
    api: { url, hash, getUsers }
  } = (config as WP).wp;
  const version = config.editorVersion;
  const body = new URLSearchParams({
    hash,
    version,
    action: Str.read(getUsers) ?? ""
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

export const getTerms: GetTerms = async (taxonomy, config) => {
  const { url, hash, getTerms } = (config as WP).wp.api;
  const version = config.editorVersion;

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version,
      taxonomy,
      action: Str.read(getTerms) ?? ""
    })
  })
    .then((r) => r.json())
    .then(({ data }) => data);
};

export const getTermsBy: GetTermsBy = async ({
  include = [],
  search = "",
  abortSignal,
  config
}) => {
  const {
    api: { url, hash, getTermsBy }
  } = (config as WP).wp;
  const version = config.editorVersion;
  const body = new URLSearchParams({
    hash,
    version,
    action: Str.read(getTermsBy) ?? ""
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
  abortSignal,
  config
}) => {
  const {
    api: { url, hash, searchPosts }
  } = (config as WP).wp;
  const version = config.editorVersion;
  const body = new URLSearchParams({
    hash,
    version,
    action: Str.read(searchPosts) ?? ""
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
  abortSignal,
  config
}) => {
  const { url, hash, getPostTaxonomies } = (config as WP).wp.api;
  const version = config.editorVersion;

  return request(url, {
    method: "POST",
    body: new URLSearchParams({
      hash,
      version,
      post_type: taxonomy,
      action: Str.read(getPostTaxonomies) ?? ""
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

//#region Rules

export const getRulePostsGroupList: GetRulePostsGroupList = async (
  postType,
  config
) => {
  const wpConfig = config as WP;
  const { wp, editorVersion } = wpConfig;
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

export const getMetafields = () => {
  return Promise.reject("Not implemented");
};

export const getBlogPostMeta = () => {
  return Promise.reject("Not implemented");
};

//#endregion
