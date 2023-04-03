import { isT, mPipe, pass } from "fp-utilities";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makeUrl } from "visual/utils/api/utils";
import * as Arr from "visual/utils/array";
import { pipe } from "visual/utils/fp";
import * as ArrReader from "visual/utils/reader/array";
import * as Obj from "visual/utils/reader/object";
import { throwOnNullish } from "visual/utils/value";

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

//#region CollectionItemsBySlug

export const getCollectionSourceItemsByType = (
  data: { slug: string },
  config: ConfigCommon
) => {
  // @ts-expect-error: TODO All this code will removed after create Client in Brizy-Cloud
  const { urls, project } = config;

  const readCollectionSourceItem = mPipe(
    pass(Obj.isObject),
    Obj.readKey("collection"),
    ArrReader.read,
    Arr.map(mPipe(pass(Obj.isObject))),
    Arr.filter(isT)
  );

  const url = makeUrl(`${urls.api}/pages/${project.id}/type`, {
    searchCriteria: "slug",
    searchValue: data.slug
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    },
    config
  )
    .then((r) => r.json())
    .then(pipe(readCollectionSourceItem, throwOnNullish("Invalid response")));
};

//#endregion

// #region CollectionItemsById

export const getCollectionSourceItemsById = (
  data: { id: string },
  config: ConfigCommon
) => {
  // @ts-expect-error: TODO All this code will be removed after create Client in Brizy-Cloud
  const { urls, project } = config;

  const readCollectionSourceItem = mPipe(
    pass(Obj.isObject),
    Obj.readKey("collection"),
    ArrReader.read,
    Arr.map(mPipe(pass(Obj.isObject))),
    Arr.filter(isT)
  );

  const url = makeUrl(`${urls.api}/pages/${project.id}/type`, {
    searchCriteria: "id",
    searchValue: data.id
  });

  return request(
    url,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    },
    config
  )
    .then((r) => r.json())
    .then(pipe(readCollectionSourceItem, throwOnNullish("Invalid response")));
};
