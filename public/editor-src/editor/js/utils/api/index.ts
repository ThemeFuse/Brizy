import { isT, mPipe, pass } from "fp-utilities";
import Config from "visual/global/Config";
import { Cloud, Shopify } from "visual/global/Config/types/configs/Cloud";
import { ShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { ReduxState } from "visual/redux/types";
import { GlobalBlock } from "visual/types";
import * as Arr from "visual/utils/array";
import { GlobalBlocksError, ProjectError } from "visual/utils/errors";
import { pipe } from "visual/utils/fp";
import * as ArrReader from "visual/utils/reader/array";
import { read } from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { throwOnNullish } from "visual/utils/value";
import {
  makeBlockMeta,
  parseBlogSourceItem,
  parseCollectionSourceItem,
  parseGlobalBlock,
  parseMetaSavedBlock,
  parsePageRules,
  parseProject,
  parseSavedBlock,
  parseSavedLayout,
  stringifyGlobalBlock,
  stringifyProject,
  stringifySavedBlock
} from "./adapter";
import { GetCollectionTypesWithFields } from "./cms/graphql/types/GetCollectionTypesWithFields";
import { paginationData } from "./const";
import {
  BlogSourceItem,
  CollectionSourceItem,
  CreateSavedBlock,
  CreateSavedLayout,
  CreateScreenshot,
  DeleteSavedBlockById,
  DeleteSavedLayoutById,
  GetCollectionSourceTypes,
  GetDynamicContent,
  GetPostsSourceRefId,
  GetPostsSourceRefs,
  GetSavedBlockById,
  GetSavedBlocksMeta,
  GetSavedLayoutById,
  GetSavedLayoutsMeta,
  ResponseWithBody,
  Rule,
  SelectedItem,
  UpdateScreenshot,
  UploadSavedBlocks,
  UploadSavedLayouts,
  UploadSavedPopups
} from "./types";
import { makeFormEncode, makeUrl } from "./utils";
export * from "./cms";
export * from "./cms/page";
export * from "./cms/popup";
export { makeFormEncode, makeUrl, parseJSON } from "./utils";

//#region Common Utils Request & PersistentRequest

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
                data: body
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

//#region Project

export function getProject(): Promise<ReduxState["project"]> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  return persistentRequest(`${api}/projects/${id}`, {
    method: "GET"
  })
    .then((r) => parseProject(r.data))
    .catch(() => {
      throw new ProjectError("Failed to get project");
    });
}

export function updateProject(
  project: ReduxState["project"],
  meta: { is_autosave?: 0 | 1 } = {}
): Promise<unknown> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  const { is_autosave = 1 } = meta;
  const { data, dataVersion } = stringifyProject(project);
  const body = new URLSearchParams({
    data,
    dataVersion: `${dataVersion}`,
    is_autosave: `${is_autosave}`
  });

  return persistentRequest(`${api}/projects/${id}`, {
    method: "PUT",
    body
  })
    .then((r) => r.data)
    .catch(() => {
      throw new ProjectError("Failed to update project");
    });
}

export function addProjectLockedBeacon(): Promise<unknown> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  return request(`${api}/projects/${id}/locks`, {
    method: "POST"
  });
}

export function removeProjectLockedSendBeacon(): boolean {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  return navigator.sendBeacon(`${api}/projects/${id}/remove_locks`);
}

//#endregion

//#region Global Blocks

const uidToApiId: Record<string, number> = {};

export function getGlobalBlocks(): Promise<Record<string, GlobalBlock>> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;
  const url = makeUrl(`${api}/global_blocks`, {
    page: `${paginationData.page}`,
    count: `${paginationData.count}`,
    project: `${id}`
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
    .then((r) => {
      return r.data
        .map(parseGlobalBlock)
        .reduce((acc, { id, uid, data, meta, rules, position, status }) => {
          // map uids to ids to use them in updates
          uidToApiId[uid] = id;

          acc[uid] = {
            id: uid,
            data,
            meta,
            rules,
            position,
            status
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
): Promise<{ data: string; meta: string; dataVersion: string; id: number }> {
  const uid = globalBlock.data.value._id;
  const { data, rules, meta, status } = stringifyGlobalBlock(globalBlock);
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;
  const requestData = new URLSearchParams({
    project: `${id}`,
    is_autosave: `${0}`,
    uid,
    status,
    data,
    rules,
    meta
  });
  type GlobalBlock = {
    data: string;
    meta: string;
    dataVersion: string;
    id: number;
  };

  return persistentRequest<GlobalBlock>(`${api}/global_blocks`, {
    method: "POST",
    body: requestData
  })
    .then((r) => {
      // map our uid to the newly created block's id
      uidToApiId[uid] = r.data.id;
      return r.data;
    })
    .catch(() => {
      throw new GlobalBlocksError("Failed to create Global Block");
    });
}

export function updateGlobalBlock(
  uid: string,
  globalBlock: GlobalBlock,
  extraMeta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  // const uid = globalBlock.data.value._id;

  const { data, rules, meta } = stringifyGlobalBlock(globalBlock);
  if (uidToApiId[uid]) {
    const { is_autosave = 1 } = extraMeta;
    const requestData = new URLSearchParams({
      uid,
      data,
      rules,
      meta,
      is_autosave: `${is_autosave}`
    });

    return persistentRequest(`${api}/global_blocks/${uidToApiId[uid]}`, {
      method: "PUT",
      body: requestData
    })
      .then((r) => r.data)
      .catch(() => {
        throw new GlobalBlocksError("Failed to update Global Blocks");
      });
  } else {
    // need some kind of retry mechanism
    return Promise.reject("not implemented yet");
  }
}

export function updateGlobalBlocks(
  globalBlocks: Record<string, GlobalBlock>,
  extraMeta: { is_autosave?: 1 | 0 } = {}
): Promise<unknown> {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  const { is_autosave = 1 } = extraMeta;
  const data = Object.entries(globalBlocks).reduce(
    (acc, [uid, globalBlock]) => {
      const { data, rules, position, meta, status } =
        stringifyGlobalBlock(globalBlock);

      acc.push({
        id: uidToApiId[uid],
        status,
        data,
        position: JSON.stringify(position),
        rules,
        meta
      });

      return acc;
    },
    [] as {
      id: number;
      status: string;
      data: string;
      position: string;
      rules: string;
      meta: string;
    }[]
  );
  const body = new URLSearchParams(makeFormEncode({ data, is_autosave }));

  return persistentRequest(`${api}/global_block/bulk`, {
    method: "PUT",
    body
  })
    .then((r) => r.data)
    .catch(() => {
      throw new GlobalBlocksError("Failed to update Global Blocks");
    });
}

//#endregion

//#region Image

export async function uploadImage(data: {
  base64: string;
}): Promise<{ name: string }> {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;

  const body = new URLSearchParams({
    attachment: data.base64
  });

  return request(`${api}/media`, {
    method: "POST",
    body
  }).then((r) => r.json());
}

//#endregion

//#region Fonts

export function getUploadedFonts(): Promise<unknown> {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;

  // mapped uid cloud to font id what used in models
  return (
    request(`${api}/fonts`, {
      method: "GET"
    })
      .then((r) => r.json())
      //@ts-expect-error: need to check this
      .then((r) => r.map(({ uid, ...data }) => ({ ...data, id: uid })))
  );
}

//#endregion

//#region Upload Files

export async function uploadFile(file: File): Promise<unknown> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;
  const base64 = await toBase64(file);

  if (typeof base64 === "string") {
    const attachment = base64.replace(/.+;base64,/, "");

    return request(`${api}/custom_files `, {
      method: "POST",
      body: new URLSearchParams({
        attachment,
        project: `${id}`,
        filename: file.name
      })
    })
      .then((r) => r.json())
      .then((value) => value);
  }

  return Promise.reject("File was Wrong");

  async function toBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}

//#endregion

//#region HeartBeat

export function sendHeartBeat(): Promise<unknown> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  return request(`${api}/projects/${id}/pings`, {
    method: "POST"
  }).then((r) => r.json());
}

export function sendHearBeatTakeOver(): Promise<unknown> {
  const {
    project: { id },
    urls: { api }
  } = Config.getAll() as Cloud;

  return request(`${api}/projects/${id}/take_overs`, {
    method: "POST"
  });
}

//#endregion

//#region getPostObjects
// eslint-disable-next-line
export const getPostObjects = async (_ = undefined) => [];

//#endregion

//#region Dynamic content

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

  const r = await request(
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

//#region Screenshots

export const createBlockScreenshot: CreateScreenshot = ({ base64 }) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request(`${api}/screenshots`, {
    method: "POST",
    body: new URLSearchParams({ attachment })
  }).then((r) => r.json());
};

export const updateBlockScreenshot: UpdateScreenshot = ({ id, base64 }) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  const attachment = base64.replace(/data:image\/.+;base64,/, "");

  return request(`${api}/screenshots/${id}`, {
    method: "PUT",
    body: new URLSearchParams({ attachment })
  }).then((r) => r.json());
};

//#endregion

//#region Saved blocks

export const getSavedBlocks: GetSavedBlocksMeta = async (pagination) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  const { page, count } = pagination || paginationData;

  const url = makeUrl(
    `${api}/saved_blocks`,
    makeFormEncode({
      page,
      count,
      fields: ["id", "meta"]
    })
  );

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then((r) =>
      // Old saved blocks don't have uid,
      // @ts-expect-error we are used id(bd id) instead of them
      r.map(parseMetaSavedBlock).map((b) => ({
        ...b,
        uid: b.id
      }))
    );
};

export const getSavedBlockById: GetSavedBlockById = (id) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;

  return request(`${api}/saved_blocks/${id}`, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(parseSavedBlock);
};

export const createSavedBlock: CreateSavedBlock = (
  savedBlock,
  extraMeta = {}
) => {
  const {
    container: { id },
    urls: { api }
  } = Config.getAll() as Cloud;
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedBlock);
  const { is_autosave = 0 } = extraMeta;
  const media = makeBlockMeta(savedBlock);

  const body = new URLSearchParams({
    uid,
    data,
    meta,
    media,
    dataVersion: `${dataVersion}`,
    is_autosave: `${is_autosave}`,
    container: `${id}`
  });

  return persistentRequest(`${api}/saved_blocks`, {
    method: "POST",
    body
  });
};

export const deleteSavedBlock: DeleteSavedBlockById = (id) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  return persistentRequest(`${api}/saved_blocks/${id}`, {
    method: "DELETE"
  });
};

export const uploadSaveBlocks: UploadSavedBlocks = async (files) => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "block");

  const r = await request(`${urls.api}/zip_templates/${project.id}/imports`, {
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

//#region Saved popups

export const uploadSavePopups: UploadSavedPopups = async (files) => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "popup");

  const r = await request(`${urls.api}/zip_templates/${project.id}/imports`, {
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

//#region Saved layouts

export const getSavedLayouts: GetSavedLayoutsMeta = (pagination) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  const { page, count } = pagination || paginationData;
  const url = makeUrl(
    `${api}/layouts`,
    makeFormEncode({
      page,
      count,
      fields: ["id", "meta"]
    })
  );

  return (
    request(url, {
      method: "GET"
    })
      .then((r) => r.json())
      // Old saved blocks don't have uid,
      // @ts-expect-error we are used id(bd id) instead of them
      .then((r) => r.map(parseMetaSavedBlock).map((b) => ({ ...b, uid: b.id })))
  );
};

export const getSavedLayoutById: GetSavedLayoutById = (id) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  return request(`${api}/layouts/${id}`, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(parseSavedLayout);
};

export const createSavedLayout: CreateSavedLayout = (
  savedLayout,
  extraMeta = {}
) => {
  const {
    container: { id },
    urls: { api }
  } = Config.getAll() as Cloud;
  const { data, dataVersion, uid, meta } = stringifySavedBlock(savedLayout);
  const { is_autosave = 0 } = extraMeta;
  const media = makeBlockMeta(savedLayout);
  const requestData = new URLSearchParams({
    data,
    uid,
    meta,
    media,
    dataVersion: `${dataVersion}`,
    is_autosave: `${is_autosave}`,
    container: `${id}`
  });

  return persistentRequest(`${api}/layouts`, {
    method: "POST",
    body: requestData
  });
};

export const deleteSavedLayout: DeleteSavedLayoutById = (id) => {
  const {
    urls: { api }
  } = Config.getAll() as Cloud;
  return persistentRequest(`${api}/layouts/${id}`, {
    method: "DELETE"
  });
};

export const uploadSaveLayouts: UploadSavedLayouts = async (files) => {
  const config = Config.getAll() as Cloud;
  const { project, urls } = config;
  const version = config.editorVersion;
  const formData = new FormData();

  for (const file of files) {
    formData.append("importTemplate[]", file);
  }

  formData.append("version", version);
  formData.append("type", "layout");

  const r = await request(`${urls.api}/zip_templates/${project.id}/imports`, {
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

  const url = makeUrl(`${urls.api}/pages/${project.id}/type`, {
    earchCriteria: v.by,
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

export const shopifySyncPage = (title: string): Promise<void> => {
  const config = Config.getAll() as Cloud;
  const { platform, project, page, urls } = config;

  const body = new URLSearchParams({
    page: `${page.id}`,
    blog_title: title,
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

//#region Posts

export const getPostsSourceRefs: GetPostsSourceRefs = (type) => {
  const config = Config.getAll() as Cloud;
  const { urls, project } = config;
  const url = makeUrl(`${urls.api}/projects/${project.id}/post_types`, {
    type
  });
  const readCollectionTypesRefs = (
    r: GetCollectionTypesWithFields["collectionTypes"]
  ) => {
    if (Array.isArray(r)) {
      const collections = r.filter(isT);
      const types = collections.map(({ id, title }) => ({ id, title }));
      const refsById = collections.reduce((acc, { id, fields }) => {
        if (fields) {
          const refs = fields
            .map((field) => {
              switch (field.__typename) {
                case "CollectionTypeFieldReference": {
                  return {
                    type: "single" as const,
                    id: field.referenceSettings.collectionType.id,
                    title: field.referenceSettings.collectionType.title
                  };
                }
                case "CollectionTypeFieldMultiReference": {
                  return {
                    type: "multi" as const,
                    id: field.multiReferenceSettings.collectionType.id,
                    title: field.multiReferenceSettings.collectionType.title
                  };
                }
              }
            })
            .filter(isT);

          if (refs.length > 0) {
            acc[id] = refs;
          }
        }

        return acc;
      }, {} as GetPostsSourceRefId);

      return { collectionTypes: types, refsById };
    }

    return undefined;
  };

  return request(url, {
    method: "GET"
  })
    .then((r) => r.json())
    .then(pipe(readCollectionTypesRefs, throwOnNullish("Invalid response")));
};

//#endregion
