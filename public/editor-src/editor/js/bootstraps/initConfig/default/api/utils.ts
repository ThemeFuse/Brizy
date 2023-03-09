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

//#region GetCollectionSourceTypes

interface CloudCollectionSourceType {
  id: string;
  title: string;
  slug?: string;
}
export type GetCollectionSourceTypes = (
  c: ConfigCommon
) => Promise<CloudCollectionSourceType[]>;

export const getCollectionSourceTypes: GetCollectionSourceTypes = async (
  config
) => {
  // @ts-expect-error: TODO All this code will removed after create Client in Brizy-Cloud
  const { urls, project } = config;
  const apiUrl = `${urls.api}/types/${project.id}`;

  return request(
    apiUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    },
    config
  )
    .then((r) => r.json())
    .catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }
      return [];
    });
};

//#endregion

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
  // @ts-expect-error: TODO All this code will removed after create Client in Brizy-Cloud
  const { urls, project } = config;

  const url = makeUrl(
    `${urls.api}/projects/${project.id}/build_collection_item_placeholders`,
    { type: data.id, title: data.search }
  );

  return request(url, { method: "GET" }, config).then((r) => r.json());
};

//#endregion
