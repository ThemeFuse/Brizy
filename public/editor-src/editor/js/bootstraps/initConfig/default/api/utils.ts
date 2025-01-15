import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makeUrl } from "visual/utils/api/utils";

export function request(
  url: string,
  config: RequestInit = {},
  editorConfig: ConfigCommon
): Promise<Response> {
  const { editorVersion } = editorConfig;
  if (TARGET === "Cloud-localhost" && editorConfig.tokenV1) {
    return fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        "x-editor-version": editorVersion,
        "x-auth-user-token": editorConfig.tokenV1
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

//#region CollectionItemsBySearch

export type CollectionItemsBySearch = (
  data: { search: string; id: string },
  config: ConfigCommon
) => Promise<{
  collection: {
    title: string;
    permalink: string;
  }[];
}>;
export const searchCollectionItems: CollectionItemsBySearch = (
  data,
  config
) => {
  const { urls, project } = config;

  const url = makeUrl(
    `${urls?.api}/projects/${project.id}/build_collection_item_placeholders`,
    { type: data.id, title: data.search }
  );

  return request(url, { method: "GET" }, config).then((r) => r.json());
};

//#endregion

// #region CollectionItemsById

export const getShopifyMetafields = (
  data: { sourceType: string },
  config: ConfigCommon
) => {
  const { project, urls } = config;

  const url = `${urls?.api}/projects/${project.id}/shopify/metafields?collectionTypeSlug=${data.sourceType}`;

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  ).then((r) => r.json());
};

export const getShopifyBlogPostMeta = (
  data: { sourceType: string },
  config: ConfigCommon
) => {
  const { project, urls } = config;

  const baseUrl = `${urls?.api}/projects/${project.id}/collection/items`;

  const url = makeUrl(baseUrl, {
    collectionTypeSlug: data.sourceType
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    },
    config
  ).then((r) => r.json());
};
