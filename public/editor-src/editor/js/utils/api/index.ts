import { ChoicesAsync } from "visual/component/Options/types/dev/MultiSelect2/types";
import { ChoicesSync } from "visual/component/Options/types/dev/Select/types";
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export * from "./cms";
export * from "./cms/popup";
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
  getCollectionSourceItemsById,
  getCollectionTypes,
  getCustomIcons,
  getDynamicContent,
  getEcwidProducts,
  getGlobalColors,
  getGlobalTypography,
  getLeadificCustomFields,
  getPageRelations,
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
  shopifyBlogItems,
  shopifySyncArticle,
  shopifySyncPage,
  shopifySyncRules,
  shopifyUnpublishPage,
  updateBlockScreenshot,
  updateEkklesiaFields,
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
export { makeFormEncode, makeUrl, parseJSON } from "./utils";

//#region Common Utils Request

export function request(
  url: string,
  config: RequestInit = {},
  globalConfig: ConfigCommon
): Promise<Response> {
  const { tokenV1, editorVersion } = globalConfig;

  if (TARGET === "Cloud-localhost") {
    return fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": editorVersion,
        "x-auth-user-token": tokenV1 ?? ""
      }
    });
  } else {
    return fetch(url, {
      credentials: "same-origin",
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": editorVersion
      }
    });
  }
}

//#endregion

export const getMetafields = (
  sourceType: string,
  config: ConfigCommon
): Promise<ChoicesSync> => {
  const metafields =
    isCloud(config) && isShopifyShop(config.modules?.shop)
      ? config?.modules?.shop?.api?.getMetafields?.handler
      : undefined;

  return new Promise((res, rej) => {
    if (typeof metafields === "function") {
      metafields(res, rej, { slug: sourceType });
    } else {
      rej("Missing api handler in config");
    }
  });
};

export const loadCollectionItems = (
  {
    collectionId,
    fieldId
  }: {
    collectionId: string;
    fieldId?: string;
  },
  config: ConfigCommon
): ChoicesAsync["load"] => {
  const loadCollectionItems =
    config?.api?.collectionItems?.loadCollectionItems?.handler;

  return (value) => {
    return new Promise((res, rej) => {
      if (typeof loadCollectionItems === "function") {
        loadCollectionItems(res, rej, { collectionId, fieldId, value });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
};

export const searchCollectionItems = (
  {
    collectionId,
    fieldId
  }: {
    collectionId?: string;
    fieldId?: string;
  },
  config: ConfigCommon
): ChoicesAsync["search"] => {
  const searchCollectionItems =
    config?.api?.collectionItems?.searchCollectionItems?.handler;

  return (search) => {
    return new Promise((res, rej) => {
      if (typeof searchCollectionItems === "function") {
        searchCollectionItems(res, rej, {
          collectionId: collectionId ?? "",
          fieldId,
          search
        });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
};
