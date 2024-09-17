import { isT, mPipe, pass } from "fp-utilities";
import { ChoicesAsync } from "visual/component/Options/types/dev/MultiSelect2/types";
import Config from "visual/global/Config";
import { isShopifyShop } from "visual/global/Config/types/configs/Base";
import {
  Cloud,
  Shopify,
  isCloud
} from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import * as Arr from "visual/utils/array";
import { pipe } from "visual/utils/fp";
import * as ArrReader from "visual/utils/reader/array";
import { read } from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import { throwOnNullish } from "visual/utils/value";
import {
  parseBlogSourceItem,
  parseCollectionSourceItem,
  parsePageRules
} from "./adapter";
import {
  BlogSourceItem,
  CollectionSourceItem,
  GetCollectionSourceTypes,
  Rule,
  SelectedItem
} from "./types";
import { makeUrl } from "./utils";

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
  defaultKitsData,
  defaultKitsMeta,
  defaultLayoutsData,
  defaultLayoutsMeta,
  defaultLayoutPages,
  defaultPopupsData,
  defaultPopupsMeta,
  defaultPostsSources,
  defaultStoriesData,
  defaultStoriesMeta,
  defaultStoriesPages,
  deleteCustomIcon,
  defaultKits,
  deleteSavedBlock,
  deleteSavedLayout,
  deleteSavedPopup,
  filterSavedBlocks,
  filterSavedLayouts,
  filterSavedPopups,
  getCollectionTypes,
  getDynamicContent,
  getCustomIcons,
  getEcwidProducts,
  getLeadificCustomFields,
  getAdobeFonts,
  getSavedBlockById,
  getSavedBlocks,
  getSavedLayoutById,
  getSavedLayouts,
  getSavedPopupById,
  getSavedPopups,
  getSourceIds,
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
  updateEkklesiaFields,
  updatePopupRules,
  updateSavedBlock,
  updateSavedLayout,
  updateSavedPopup,
  getGlobalColors,
  getGlobalTypography
} from "./common";
export { makeFormEncode, makeUrl, parseJSON } from "./utils";

//#region Common Utils Request

export function request(
  url: string,
  config: RequestInit = {}
): Promise<Response> {
  if (TARGET === "Cloud-localhost") {
    return fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": Config.get("editorVersion"),
        "x-auth-user-token": Config.get("tokenV1")
      }
    });
  } else {
    return fetch(url, {
      credentials: "same-origin",
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": Config.get("editorVersion")
      }
    });
  }
}

//#endregion

//#region getPostObjects
// eslint-disable-next-line
export const getPostObjects = async (_ = undefined) => [];

//#endregion

type T = { by: "id"; value: string } | { by: "slug"; value: ShopifyTemplate };

function getCollectionSourceItems(v: T): Promise<CollectionSourceItem[]> {
  const config = Config.getAll() as Cloud;
  const { urls, project } = config;
  const readCollectionSourceItem = mPipe(
    pass(Obj.isObject),
    Obj.readKey("collection"),
    ArrReader.read,
    Arr.map(mPipe(pass(Obj.isObject), parseCollectionSourceItem)),
    Arr.filter(isT)
  );

  const url = makeUrl(`${urls.api}/pages/${project.id}/type`, {
    searchCriteria: v.by,
    searchValue: v.value
  });

  return request(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((r) => r.json())
    .then(pipe(readCollectionSourceItem, throwOnNullish("Invalid response")));
}

export const getCollectionSourceTypes: GetCollectionSourceTypes = async () => {
  const config = Config.getAll() as Cloud;

  const { urls, project } = config;

  return await request(`${urls.api}/types/${project.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((r) => r.json())
    .catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
      return [];
    });
};

export const getCollectionSourceItemsById = (
  id: string
): Promise<CollectionSourceItem[]> => {
  return getCollectionSourceItems({ by: "id", value: id });
};

//#region page rules
// right now is used only shopify integration

const readMeta = mPipe(
  pass(Obj.isObject),
  Obj.readKey("value"),
  read,
  pass(Obj.isObject)
);

export const getPageRelations = async (config: Shopify): Promise<Rule[]> => {
  const { project, urls, page } = config;

  return (
    request(`${urls.api}/projects/${project.id}/shopify_relation`, {
      method: "GET"
    })
      .then((r) => (r.ok ? r : undefined))
      .then(throwOnNullish("fetch page rules error"))
      .then((r) => r.json())
      .then(readMeta)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(throwOnNullish<Record<any, any>>("fetch page rules error"))
      .then((t) => t[page.id] ?? [])
      .then(
        mPipe(
          ArrReader.read,
          Arr.map(mPipe(pass(Obj.isObject), parsePageRules)),
          Arr.filter(isT)
        )
      )
      .then(throwOnNullish("fetch page rules error"))
  );
};

export const shopifySyncRules = (
  rules: SelectedItem[],
  title: string
): Promise<void> => {
  const config = Config.getAll() as Cloud;
  const { platform, project, page, urls } = config;

  const body = new URLSearchParams({
    page: `${page.id}`,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    assigned_items: JSON.stringify(rules.map(({ selected, ...i }) => i)),
    title
  });

  return request(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then((r) => {
    if (!r.ok) {
      throw new Error("Unable to sync");
    }
  });
};

export const shopifySyncArticle = (
  blogId: string,
  blogTitle: string,
  title: string
): Promise<void> => {
  const config = Config.getAll() as Cloud;
  const { platform, project, page, urls } = config;

  const body = new URLSearchParams({
    page: `${page.id}`,
    blog_id: blogId,
    blog_title: blogTitle,
    title: title
  });

  return request(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then((r) => {
    if (!r.ok) {
      throw new Error("Unable to sync");
    }
  });
};

export const shopifySyncPage = (
  title: string,
  isHomePage: boolean
): Promise<void> => {
  const config = Config.getAll() as Cloud;
  const { platform, project, page, urls } = config;

  const body = new URLSearchParams({
    page: `${page.id}`,
    blog_title: title,
    title,
    isHomePage: isHomePage ? "1" : "0"
  });

  return request(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then((r) => {
    if (!r.ok) {
      throw new Error("Unable to sync");
    }
  });
};

export const shopifyBlogItems = (): Promise<BlogSourceItem[]> => {
  const config = Config.getAll() as Cloud;
  const { urls, project } = config;
  const readBlogSourceItem = mPipe(
    pass(Obj.isObject),
    Obj.readKey("blogs"),
    ArrReader.read,
    Arr.map(mPipe(pass(Obj.isObject), parseBlogSourceItem)),
    Arr.filter(isT)
  );

  return request(`${urls.api}/shopify/projects/${project.id}/blogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((r) => r.json())
    .then(pipe(readBlogSourceItem, throwOnNullish("Invalid response")));
};

export const shopifyUnpublishPage = (config: Shopify): Promise<void> => {
  const { project, page, urls } = config;

  const body = new URLSearchParams({
    project: `${project.id}`,
    page: page.id
  });

  return request(
    `${urls.api}/shopify/projects/${config.project.id}/unpublish`,
    {
      method: "POST",
      body
    }
  ).then((r) => {
    if (!r.ok) {
      throw new Error("Something gone wrong");
    }
  });
};

//#endregion

export const getMetafields = (
  sourceType: string,
  config: ConfigCommon
): ChoicesAsync["load"] => {
  const metafields =
    isCloud(config) && isShopifyShop(config.modules?.shop)
      ? config?.modules?.shop?.api?.metafieldsLoad?.handler
      : undefined;
  return () => {
    return new Promise((res, rej) => {
      if (typeof metafields === "function") {
        metafields(res, rej, { sourceType });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
};

export const getBlogPostMeta = (
  sourceType: string,
  config: ConfigCommon
): ChoicesAsync["load"] => {
  const blogPostsMeta =
    isCloud(config) && isShopifyShop(config.modules?.shop)
      ? config?.modules?.shop?.api?.blogPostMetaLoad?.handler
      : undefined;

  return () => {
    return new Promise((res, rej) => {
      if (typeof blogPostsMeta === "function") {
        blogPostsMeta(res, rej, { sourceType });
      } else {
        rej("Missing api handler in config");
      }
    });
  };
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
