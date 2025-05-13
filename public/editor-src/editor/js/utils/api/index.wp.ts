import { WP } from "visual/global/Config";
import { GetRulePostsGroupList } from "./types";
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
  updateSavedPopup,
  getMenus,
  updateFeaturedImage,
  updateFeaturedImageFocalPoint,
  removeFeaturedImage,
  shortcodeContent,
  getAuthors,
  getPosts,
  getPostTaxonomies,
  getTerms,
  getTermsBy,
  getRulesList,
  getGroupList,
  getSidebars
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

//#endregion
