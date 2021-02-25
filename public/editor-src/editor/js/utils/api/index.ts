export * from "./index-legacy";
export * from "./cms";
export * from "./pageCloud";

import Config from "visual/global/Config";
import { request2, persistentRequest } from "./index-legacy";
import {
  makeBlockMeta,
  ParsedSavedBlockApiMeta,
  parseMetaSavedBlock,
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
  GetDynamicContent
} from "./types";

const paginationData = {
  page: 1,
  count: 200
};

// dynamic content

export const getDynamicContent: GetDynamicContent = ({
  placeholders,
  signal
}) => {
  const apiUrl = Config.get("urls").api;
  const projectId = Config.get("project").id;
  const pageId = Config.get("page").id;
  const qs = new URLSearchParams();

  qs.append("post_id", pageId);
  for (const p of placeholders) {
    qs.append("placeholders[]", p);
  }

  // mapped uid cloud to font id what used in models
  return request2(`${apiUrl}/projects/${projectId}/placeholders?${qs}`, {
    method: "GET",
    signal
  }).then(r => {
    if (!r.ok) {
      // TODO: add proper error handling
      throw new Error("fetch dynamic content error");
    }

    return r.json();
  });
};

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

// saved blocks

export const getSavedBlocks: GetSavedBlocksMeta = () => {
  const requestData = {
    ...paginationData,
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
  const { is_autosave = 0 } = extraMeta; // eslint-disable-line @typescript-eslint/camelcase
  const media = makeBlockMeta(savedBlock);

  const requestData = {
    uid,
    data,
    dataVersion,
    is_autosave, // eslint-disable-line @typescript-eslint/camelcase
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

// saved layouts

export const getSavedLayouts: GetSavedLayoutsMeta = () => {
  const requestData = {
    ...paginationData,
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
  const { is_autosave = 0 } = extraMeta; // eslint-disable-line @typescript-eslint/camelcase
  const media = makeBlockMeta(savedLayout);
  const requestData = {
    data,
    dataVersion,
    uid,
    is_autosave, // eslint-disable-line @typescript-eslint/camelcase
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
