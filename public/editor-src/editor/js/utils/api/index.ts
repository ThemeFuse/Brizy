import { Cloud, Shopify } from "visual/global/Config/types/configs/Cloud";

export * from "./index-legacy";
export * from "./cms";
export * from "./cms/page";
export * from "./cms/popup";

import Config from "visual/global/Config";
import * as Obj from "visual/utils/reader/object";
import * as ArrReader from "visual/utils/reader/array";
import * as Str from "visual/utils/reader/string";
import { persistentRequest } from "./index-legacy";
import {
  makeBlockMeta,
  parseBlogSourceItem,
  parseCollectionSourceItem,
  ParsedSavedBlockApiMeta,
  parseMetaSavedBlock,
  parsePageRules,
  parseSavedBlock,
  parseSavedLayout,
  stringifySavedBlock
} from "./adapter";
import {
  CreateSavedLayout,
  CreateSavedBlock,
  CreateScreenshot,
  DeleteSavedLayoutById,
  DeleteSavedBlockById,
  GetSavedLayoutById,
  GetSavedLayoutsMeta,
  GetSavedBlockById,
  GetSavedBlocksMeta,
  UpdateScreenshot,
  GetDynamicContent,
  UploadSavedBlocks,
  UploadSavedLayouts,
  UploadSavedPopups,
  GetCollectionSourceTypes,
  Rule,
  SelectedItem,
  CollectionSourceItem,
  BlogSourceItem
} from "./types";
import { read } from "visual/utils/reader/json";
import { isT, mPipe, pass } from "fp-utilities";
import * as Arr from "visual/utils/array";
import { throwOnNullish } from "visual/utils/value";
import { pipe } from "visual/utils/fp";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";

const paginationData = {
  page: 1,
  count: 200
};

//#region dynamic content

export const getDynamicContent: GetDynamicContent = async ({
  placeholders,
  signal
}) => {
  const apiUrl = Config.get("urls").api;
  const projectId = Config.get("project").id;
  const body = new URLSearchParams();

  for (const [postId, placeholders_] of Object.entries(placeholders)) {
    if (placeholders_) {
      for (const p of placeholders_) {
        body.append(`p[${postId}][]`, p);
      }
    }
  }

  const r = await request2(
    `${apiUrl}/projects/${projectId}/placeholders_bulks`,
    { method: "POST", body, signal }
  );

  if (!r.ok) {
    throw new Error("fetch dynamic content error");
  }

  const json = await r.json();
  const dc = Obj.readWithValueReader(ArrReader.readWithItemReader(Str.read))(
    json
  );

  if (dc === undefined) {
    throw new Error("fetch dynamic content error");
  }

  return dc;
};

//#endregion

// screenshots

export const createBlockScreenshot: CreateScreenshot = ({ base64 }) => {
  const apiUrl = Config.get("urls").api;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(`${apiUrl}/screenshots`, {
    method: "POST",
    body: new URLSearchParams({ attachment })
  }).then(r => r.json());
};

export const updateBlockScreenshot: UpdateScreenshot = ({ id, base64 }) => {
  const apiUrl = Config.get("urls").api;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request2(`${apiUrl}/screenshots/${id}`, {
    method: "PUT",
    body: new URLSearchParams({ attachment })
  }).then(r => r.json());
};

//#region saved blocks

export const getSavedBlocks: GetSavedBlocksMeta = pagination => {
  // TODO: right now cloud doesn't support orderBy
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { order, ..._pagination } = pagination || {};
  const requestData = {
    ...paginationData,
    ..._pagination,
    // TODO: Temporary need review api
    // orderBy: pagination?.order ?? "ASC",
    "fields[0]": "id",
    "fields[1]": "meta"
  };
  const apiUrl = Config.get("urls").api;

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: `${apiUrl}/saved_blocks`,
    data: requestData
  }).then(r =>
    r.map(parseMetaSavedBlock).map((b: ParsedSavedBlockApiMeta) => ({
      ...b,
      uid: b.id
    }))
  );
};

export const getSavedBlockById: GetSavedBlockById = id => {
  const apiUrl = Config.get("urls").api;
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: `${apiUrl}/saved_blocks/${id}`
  }).then(parseSavedBlock);
};

export const createSavedBlock: CreateSavedBlock = (
  savedBlock,
  extraMeta = {}
) => {
  const apiUrl = Config.get("urls").api;
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedBlock);
  const containerId = Config.get("container").id;
  const { is_autosave = 0 } = extraMeta;
  const media = makeBlockMeta(savedBlock);

  const requestData = {
    uid,
    data,
    dataVersion,
    is_autosave,
    meta,
    media,
    container: containerId
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: `${apiUrl}/saved_blocks`,
    data: requestData
  });
};

export const deleteSavedBlock: DeleteSavedBlockById = id => {
  const apiUrl = Config.get("urls").api;
  return persistentRequest({
    type: "DELETE",
    dataType: "json",
    url: `${apiUrl}/saved_blocks/${id}`
  });
};

export const uploadSaveBlocks: UploadSavedBlocks = async files => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "block");

  const r = await request2(`${urls.api}/zip_templates/${project.id}/imports`, {
    method: "POST",
    body: formData
  });
  const rj = await r.json();

  if (rj.success && rj.errors && rj.success) {
    return {
      errors: rj.errors,
      success: rj.success.map(parseSavedBlock)
    };
  }

  throw rj;
};

//#endregion

//#region saved popups

export const uploadSavePopups: UploadSavedPopups = async files => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "popup");

  const r = await request2(`${urls.api}/zip_templates/${project.id}/imports`, {
    method: "POST",
    body: formData
  });
  const rj = await r.json();

  if (rj.success && rj.errors && rj.success) {
    return {
      errors: rj.errors,
      success: rj.success.map(parseSavedBlock)
    };
  }

  throw rj;
};

//#endregion

//#region saved layouts

export const getSavedLayouts: GetSavedLayoutsMeta = pagination => {
  // TODO: right now cloud doesn't support orderBy
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { order, ..._pagination } = pagination || {};
  const requestData = {
    ...paginationData,
    ..._pagination,
    // TODO: Temporary need review api
    // orderBy: pagination?.order ?? "ASC",
    "fields[0]": "id",
    "fields[1]": "meta"
  };
  const apiUrl = Config.get("urls").api;

  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: `${apiUrl}/layouts`,
    data: requestData
  }).then(r =>
    r
      .map(parseMetaSavedBlock)
      .map((b: ParsedSavedBlockApiMeta) => ({ ...b, uid: b.id }))
  );
};

export const getSavedLayoutById: GetSavedLayoutById = id => {
  const apiUrl = Config.get("urls").api;
  return persistentRequest({
    type: "GET",
    dataType: "json",
    url: `${apiUrl}/layouts/${id}`
  }).then(parseSavedLayout);
};

export const createSavedLayout: CreateSavedLayout = (
  savedLayout,
  extraMeta = {}
) => {
  const apiUrl = Config.get("urls").api;
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedLayout);
  const containerId = Config.get("container").id;
  const { is_autosave = 0 } = extraMeta;
  const media = makeBlockMeta(savedLayout);
  const requestData = {
    data,
    dataVersion,
    uid,
    is_autosave,
    meta,
    media,
    container: containerId
  };

  return persistentRequest({
    type: "POST",
    dataType: "json",
    url: `${apiUrl}/layouts`,
    data: requestData
  });
};

export const deleteSavedLayout: DeleteSavedLayoutById = id => {
  const apiUrl = Config.get("urls").api;
  return persistentRequest({
    type: "DELETE",
    dataType: "json",
    url: `${apiUrl}/layouts/${id}`
  });
};

export const uploadSaveLayouts: UploadSavedLayouts = async files => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "layout");

  const r = await request2(`${urls.api}/zip_templates/${project.id}/imports`, {
    method: "POST",
    body: formData
  });
  const rj = await r.json();

  if (rj.success && rj.errors && rj.success) {
    return {
      errors: rj.errors,
      success: rj.success.map(parseSavedLayout)
    };
  }

  throw rj;
};

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

  return request2(
    `${urls.api}/pages/${project.id}/type?searchCriteria=${v.by}&searchValue=${v.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
    .then(r => r.json())
    .then(pipe(readCollectionSourceItem, throwOnNullish("Invalid response")));
}

export const getCollectionSourceTypes: GetCollectionSourceTypes = async () => {
  const config = Config.getAll() as Cloud;

  const { urls, project } = config;

  return await request2(`${urls.api}/types/${project.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())
    .catch(e => {
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

export function getCollectionSourceItemsByType(
  type: ShopifyTemplate
): Promise<CollectionSourceItem[]> {
  return getCollectionSourceItems({ by: "slug", value: type });
}

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
    request2(`${urls.api}/projects/${project.id}/shopify_relation`, {
      method: "GET"
    })
      .then(r => (r.ok ? r : undefined))
      .then(throwOnNullish("fetch page rules error"))
      .then(r => r.json())
      .then(readMeta)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(throwOnNullish<Record<any, any>>("fetch page rules error"))
      .then(t => t[page.id] ?? [])
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

  return request2(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then(r => {
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

  return request2(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then(r => {
    if (!r.ok) {
      throw new Error("Unable to sync");
    }
  });
};

export const shopifySyncPage = (title: string): Promise<void> => {
  const config = Config.getAll() as Cloud;
  const { platform, project, page, urls } = config;

  const body = new URLSearchParams({
    page: `${page.id}`,
    blog_title: title,
    title
  });

  return request2(`${urls.api}/${platform}/projects/${project.id}/sync`, {
    method: "POST",
    body
  }).then(r => {
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

  return request2(`${urls.api}/shopify/projects/${project.id}/blogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())
    .then(pipe(readBlogSourceItem, throwOnNullish("Invalid response")));
};

export const shopifyUnpublishPage = (config: Shopify): Promise<void> => {
  const { project, page, urls } = config;

  const body = new URLSearchParams({
    project: `${project.id}`,
    page: page.id
  });

  return request2(
    `${urls.api}/shopify/projects/${config.project.id}/unpublish`,
    {
      method: "POST",
      body
    }
  ).then(r => {
    if (!r.ok) {
      throw new Error("Something gone wrong");
    }
  });
};
//#endregion

// a thin wrapper around fetch
export function request2(
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

// pending request
